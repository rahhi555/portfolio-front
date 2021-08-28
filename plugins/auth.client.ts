import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import firebase from '~/plugins/firebase'
import { SnackbarStore, UserStore } from '~/store'
import { Payload } from '~/store/snackbar'

export interface RegisterValues {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export interface AuthValues {
  email: string
  password: string
}

export default defineNuxtPlugin((ctx, inject) => {
  let payload: Payload = { color: 'info', message: '' }

  // finallyの共通処理。ローディング画面の停止およびスナックバーの表示
  const finallyFunc = () => {
    ctx.app.loading = false
    SnackbarStore.visible(payload)
  }

  // 認証後に飛ばされるページ
  const PUSH_PAGE = '/dashboard/plans'

  // apiのユーザー作成リクエスト
  const createUserApi = async (payloadName: string | null | undefined) => {
    const token = await firebase.auth().currentUser?.getIdToken()
    ctx.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
    ctx.$axios
      .post('/api/v1/users', { user: { name: payloadName } })
      .then(async () => {
        payload = {
          color: 'success',
          message: 'ユーザー登録に成功しました',
        }
        await UserStore.setUser()
        ctx.app.router?.push(PUSH_PAGE)
      })
      .catch(() => {
        payload = {
          color: 'error',
          message: 'ユーザー作成に失敗しました',
        }
        const user = firebase.auth().currentUser
        user?.delete()
      })
      .finally(() => {
        finallyFunc()
      })
  }

  // firebaseのエラーコードをもとにメッセージ作成
  const errorPayload = (code: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        payload = {
          color: 'error',
          message: 'すでにそのメールアドレスは使用されています',
        }
        break
      case 'auth/invalid-email':
        payload = { color: 'error', message: '無効なメールアドレスです' }
        break
      case 'auth/user-disabled':
        payload = { color: 'error', message: '無効なユーザーです' }
        break
      case 'auth/user-not-found':
        payload = { color: 'error', message: 'ユーザーが存在しません' }
        break
      case 'auth/wrong-password':
        payload = { color: 'error', message: '無効なパスワードです' }
        break
      case 'auth/credential-already-in-use':
        payload = {
          color: 'error',
          message: 'すでにそのメールアドレスは使用されています',
        }
        break
      case 'auth/popup-closed-by-user':
        payload = {
          color: 'warning',
          message: 'ログイン処理をキャンセルしました',
        }
        break
      default:
        payload = { color: 'error', message: '認証に失敗しました' }
        break
    }
  }

  // メールアドレスとパスワードでユーザー登録
  const emailAndPasswordRegister = (registerValues: RegisterValues): void => {
    ctx.app.loading = true
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        registerValues.email,
        registerValues.password
      )
      .then(() => {
        createUserApi(registerValues.name)
      })
      .catch((e) => {
        errorPayload(e.code)
      })
      .finally(() => {
        finallyFunc()
      })
  }

  // メールアドレスとパスワードでログイン
  const emailAndPasswordLogin = (authValues: AuthValues): void => {
    ctx.app.loading = true
    firebase
      .auth()
      .signInWithEmailAndPassword(authValues.email, authValues.password)
      .then(async () => {
        await UserStore.setUser()
        payload = { color: 'success', message: 'ログインに成功しました' }
        ctx.app.router?.push(PUSH_PAGE)
      })
      .catch((e) => {
        errorPayload(e.code)
      })
      .finally(() => {
        finallyFunc()
      })
  }

  // 匿名ユーザーでログイン
  const signInAnonymouly = () => {
    ctx.app.loading = true
    firebase
      .auth()
      .signInAnonymously()
      .then(async () => {
        payload = {
          color: 'success',
          message: '匿名ユーザーとしてログインしました',
        }
        await UserStore.setUser()
        ctx.app.router?.push(PUSH_PAGE)
      })
      .catch((e) => {
        errorPayload(e.code)
      })
      .finally(() => {
        finallyFunc()
      })
  }

  // グーグルアカウントでログインあるいはユーザー作成＋ログイン
  const googleLogin = (): void => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (res) => {
        if (res.additionalUserInfo?.isNewUser) {
          ctx.app.loading = true

          /* @ts-ignore */
          createUserApi(res.additionalUserInfo?.profile?.name)
        } else {
          await UserStore.setUser()
          payload = { color: 'success', message: 'ログインに成功しました' }
          ctx.app.router?.push(PUSH_PAGE)
        }
      })
      .catch((e) => {
        errorPayload(e.code)
      })
      .finally(() => {
        finallyFunc()
      })
  }

  // 匿名ユーザーを永久アカウントに変換(メールアドレスとパスワード)
  const emailAndPasswordCredential = (registerValues: RegisterValues) => {
    const anonymousUser = firebase.auth().currentUser

    if (anonymousUser === null || !anonymousUser.isAnonymous) {
      payload = {
        color: 'error',
        message: '仮ユーザー情報を取得できませんでした',
      }
      SnackbarStore.visible(payload)
      return
    }

    const credential = firebase.auth.EmailAuthProvider.credential(
      registerValues.email,
      registerValues.password
    )

    anonymousUser
      .linkWithCredential(credential)
      .then(() => {
        ctx.app.loading = true
        createUserApi(registerValues.name)
      })
      .catch((e) => {
        errorPayload(e.code)
        finallyFunc()
      })
  }

  // 匿名ユーザーを永久アカウントに変換(グーグルアカウント)
  const googleCredential = () => {
    const anonymousUser = firebase.auth().currentUser
    
    if (anonymousUser === null || !anonymousUser.isAnonymous) {
      payload = {
        color: 'error',
        message: '仮ユーザー情報を取得できませんでした',
      }
      SnackbarStore.visible(payload)
      return
    }

    const provider = new firebase.auth.GoogleAuthProvider()

    anonymousUser
      .linkWithPopup(provider)
      .then((res) => {
        ctx.app.loading = true
        /* @ts-ignore */
        createUserApi(res.additionalUserInfo?.profile?.name)
      })
      .catch((e) => {
        errorPayload(e.code)
        finallyFunc()
      })
  }

  // ログアウト
  const logout = () => {
    UserStore.removeUser()
    SnackbarStore.visible({ color: 'success', message: 'ログアウトしました' })
    ctx.app.router?.push('/')
  }

  // ユーザー退会
  const unRegister = () => {
    const user = firebase.auth().currentUser

    if(!user) {
      SnackbarStore.visible({ color: 'error', message: '現在のユーザーを取得できませんでした' })
      return  
    }
    
    ctx.$axios.$delete('/api/v1/me').then(() => {
      user.delete()
      UserStore.removeUser()
      SnackbarStore.visible({ color: 'success', message: '退会しました' })
      ctx.app.router?.push('/')
    })
    .catch(() => {
      SnackbarStore.visible({ color: 'error', message: '退会処理に失敗しました' })
    })
  }

  // $auth.メソッド()のようにアクセスできるようにする
  inject('auth', {
    emailAndPasswordRegister: (value: RegisterValues) => emailAndPasswordRegister(value),
    logout: () => logout(),
    emailAndPasswordLogin: (value: AuthValues) => emailAndPasswordLogin(value),
    signInAnonymouly: () => signInAnonymouly(),
    googleLogin: () => googleLogin(),
    emailAndPasswordCredential: (value: RegisterValues) => emailAndPasswordCredential(value),
    googleCredential: () => googleCredential(),
    unRegister: () => unRegister()
  })
})

declare module '@nuxt/types' {
  interface Context {
    $auth: {
      emailAndPasswordRegister: (registerValue: RegisterValues) => void
      logout: () => void
      emailAndPasswordLogin: (authValues: AuthValues) => void
      signInAnonymouly: () => void
      googleLogin: () => void
      emailAndPasswordCredential: (registerValues: RegisterValues) => void
      googleCredential: () => void
      unRegister: () => void
    }
  }
}
