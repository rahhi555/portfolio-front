import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { auth } from '~/plugins/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  EmailAuthProvider,
  linkWithCredential,
  linkWithPopup,
  sendPasswordResetEmail as sendPasswordResetEmailFirebase,
} from 'firebase/auth'
import { SnackbarStore, UserStore } from '~/store'
import { Payload } from '~/store/ui/snackbar'

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
  const createUserApi = async (method: 'post' | 'patch', payloadName: string | null | undefined) => {
    const url = method === 'post' ? '/api/v1/users' : '/api/v1/me'

    await UserStore.setToken()

    ctx.$axios.defaults.headers.common.Authorization = `Bearer ${UserStore.token}`
    ctx.$axios
      .request({
        method,
        url,
        data: {
          user: {
            name: payloadName,
          },
        },
      })
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
          message: 'ユーザー登録に失敗しました',
        }
        const user = auth.currentUser
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
        console.error(code)
        break
    }
  }

  // メールアドレスとパスワードでユーザー登録
  const emailAndPasswordRegister = (registerValues: RegisterValues): void => {
    ctx.app.loading = true
    createUserWithEmailAndPassword(auth, registerValues.email, registerValues.password)
      .then(() => {
        createUserApi('post', registerValues.name)
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
    signInWithEmailAndPassword(auth, authValues.email, authValues.password)
      .then(async () => {
        UserStore.setToken()
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

  // 匿名ユーザーでユーザー作成
  const signInAnonymouly = () => {
    ctx.app.loading = true
    signInAnonymously(auth)
      .then(() => {
        createUserApi('post', 'お試しユーザー')
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
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const additionalUserInfo = getAdditionalUserInfo(res)

        if (additionalUserInfo?.isNewUser) {
          ctx.app.loading = true

          /* @ts-ignore */
          createUserApi('post', additionalUserInfo.profile?.name)
        } else {
          UserStore.setToken()
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
    const anonymousUser = auth.currentUser

    if (anonymousUser === null || !UserStore.isAnonymous) {
      payload = {
        color: 'error',
        message: '仮ユーザー情報を取得できませんでした',
      }
      SnackbarStore.visible(payload)
      return
    }

    const credential = EmailAuthProvider.credential(registerValues.email, registerValues.password)

    linkWithCredential(anonymousUser, credential)
      .then(() => {
        ctx.app.loading = true
        createUserApi('patch', registerValues.name)
      })
      .catch((e) => {
        errorPayload(e.code)
        finallyFunc()
      })
  }

  // 匿名ユーザーを永久アカウントに変換(グーグルアカウント)
  const googleCredential = () => {
    const anonymousUser = auth.currentUser

    if (anonymousUser === null || !UserStore.isAnonymous) {
      payload = {
        color: 'error',
        message: '仮ユーザー情報を取得できませんでした',
      }
      SnackbarStore.visible(payload)
      return
    }

    const provider = new GoogleAuthProvider()

    linkWithPopup(anonymousUser, provider)
      .then((res) => {
        ctx.app.loading = true
        // @ts-ignore
        createUserApi('patch', getAdditionalUserInfo(res).profile?.name)
      })
      .catch((e) => {
        errorPayload(e.code)
        finallyFunc()
      })
  }

  // ログアウト
  const logout = () => {
    // protected.vueのonMountedの関係上先にremoveUserを実行し、その後signOutする必要あり
    UserStore.removeUser()
    auth
      .signOut()
      .then(() => {
        payload = { color: 'success', message: 'ログアウトしました' }
        ctx.app.router?.push('/')
      })
      .catch((e) => {
        errorPayload(e.code)
      })
      .finally(() => {
        finallyFunc()
      })
  }

  // ユーザー退会
  const unRegister = () => {
    const user = auth.currentUser

    if (!user) {
      SnackbarStore.visible({
        color: 'error',
        message: '現在のユーザーを取得できませんでした',
      })
      return
    }

    ctx.$axios
      .$delete('/api/v1/me')
      .then(() => {
        user.delete()
        UserStore.removeUser()
        SnackbarStore.visible({ color: 'success', message: '退会しました' })
        ctx.app.router?.push('/')
      })
      .catch(() => {
        SnackbarStore.visible({
          color: 'error',
          message: '退会処理に失敗しました',
        })
      })
  }

  /** パスワード再設定メール送信 */
  const sendPasswordResetEmail = (email: string) => {
    ctx.app.loading = true
    sendPasswordResetEmailFirebase(auth, email)
      .then(() => {
        payload = {
          color: 'success',
          message: 'パスワード再設定メールを送信しました',
        }
      })
      .catch((e) => {
        errorPayload(e.code)
      })
      .finally(() => finallyFunc())
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
    unRegister: () => unRegister(),
    sendPasswordResetEmail: (email: string) => sendPasswordResetEmail(email),
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
      sendPasswordResetEmail: (email: string) => void
    }
  }
}
