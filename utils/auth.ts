import firebase from '~/plugins/firebase'
import { SnackbarStore } from '~/store'
import { Payload } from '~/store/snackbar'

let payload: Payload = { color: 'info', message: '' }

interface RegisterValues {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

interface AuthValues {
  email: string
  password: string
}

const $axios = window.$nuxt.$axios
const $router = window.$nuxt.$router

// finallyの共通処理。ローディング画面の停止およびスナックバーの表示
const finallyFunc = () => {
  window.$nuxt.$loading.finish()
  SnackbarStore.visibleAction(payload)
}

// apiのユーザー作成リクエスト
const createUserApi = (payloadName: string | null | undefined) => {
  $axios
    .post('/api/v1/users', { user: { name: payloadName } })
    .then(() => {
      payload = {
        color: 'success',
        message: 'ユーザー登録に成功しました',
      }
      $router.push('/')
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
      payload = { color: 'error', message: 'すでにそのメールアドレスは使用されています' }
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
      payload = { color: 'error', message: 'すでにそのメールアドレスは使用されています' }
      break
    case 'auth/popup-closed-by-user':
      payload = { color: 'warning', message: 'ログイン処理をキャンセルしました' }
      break
    default:
      payload = { color: 'error', message: '認証に失敗しました' }
      break
  }
}

// ssr時に読み込むとエラー(window is not defined)になるので関数発動時に読み込ませること
// 例：
// const emailAndPasswordRegister = () => {
//   import('~/utils/auth').then((module) => {
//     module.emailAndPasswordRegister(registerValues)
//   })
// }

// メールアドレスとパスワードでユーザー登録
export const emailAndPasswordRegister = (
  registerValues: RegisterValues
): void => {
  window.$nuxt.$loading.start()
  firebase
    .auth()
    .createUserWithEmailAndPassword(
      registerValues.email,
      registerValues.password
    )
    .then(async (res) => {
      const token = await res.user?.getIdToken()
      $axios.defaults.headers.common.Authorization = `Bearer ${token}`
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
export const emailAndPasswordLogin = (authValues: AuthValues): void => {
  window.$nuxt.$loading.start()
  firebase
    .auth()
    .signInWithEmailAndPassword(authValues.email, authValues.password)
    .then(() => {
      payload = { color: 'success', message: 'ログインに成功しました' }
      $router.push('/')
    })
    .catch((e) => {
      errorPayload(e.code)
    })
    .finally(() => {
      finallyFunc()
    })
}

// 匿名ユーザーでログイン
export const signInAnonymouly = () => {
  window.$nuxt.$loading.start()
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      payload = {
        color: 'success',
        message: '匿名ユーザーとしてログインしました',
      }
      $router.push('/')
    })
    .catch((e) => {
      errorPayload(e.code)
    })
    .finally(() => {
      finallyFunc()
    })
}

// グーグルアカウントでログインあるいはユーザー作成＋ログイン
export const googleLogin = (): void => {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(async (res) => {
      if (res.additionalUserInfo?.isNewUser) {
        window.$nuxt.$loading.start()

        const token = await res.user?.getIdToken()
        $axios.defaults.headers.common.Authorization = `Bearer ${token}`
        createUserApi(res.additionalUserInfo?.profile?.name)
      } else {
        payload = { color: 'success', message: 'ログインに成功しました' }
        $router.push('/')
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
export const emailAndPasswordCredential = (registerValues: RegisterValues) => {
  const anonymousUser = firebase.auth().currentUser

  if (anonymousUser === null || !anonymousUser.isAnonymous) {
    payload = {
      color: 'error',
      message: '仮ユーザー情報を取得できませんでした',
    }
    SnackbarStore.visibleAction(payload)
    return
  }

  const credential = firebase.auth.EmailAuthProvider.credential(
    registerValues.email,
    registerValues.password
  )

  anonymousUser
    .linkWithCredential(credential)
    .then(async (res) => {
      window.$nuxt.$loading.start()
      const token = await res.user?.getIdToken()
      $axios.defaults.headers.common.Authorization = `Bearer ${token}`
      createUserApi(registerValues.name)
    })
    .catch((e) => {
      errorPayload(e.code)
      finallyFunc()
    })
}

// 匿名ユーザーを永久アカウントに変換(グーグルアカウント)
export const googleCredential = () => {
  const anonymousUser = firebase.auth().currentUser

  if (anonymousUser === null || !anonymousUser.isAnonymous) {
    payload = {
      color: 'error',
      message: '仮ユーザー情報を取得できませんでした',
    }
    SnackbarStore.visibleAction(payload)
    return
  }

  const provider = new firebase.auth.GoogleAuthProvider()

  anonymousUser
    .linkWithPopup(provider)
    .then(async (res) => {
      window.$nuxt.$loading.start()
      const token = await res.user?.getIdToken()
      $axios.defaults.headers.common.Authorization = `Bearer ${token}`
      createUserApi(res.additionalUserInfo?.profile?.name)
    })
    .catch((e) => {
      errorPayload(e.code)
      finallyFunc()
    })
}
