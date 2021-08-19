<template>
  <v-container id="login-view" class="fill-height" tag="section">
    <v-row justify="center">
      <v-col cols="12">
        <v-slide-y-transition appear>
          <MaterialCard
            light
            max-width="350"
            rounded
            class="mx-auto"
            color="accent"
            full-header
          >
            <template #heading>
              <div class="text-center pa-5">
                <div class="text-h4 font-weight-bold white--text">Login</div>
                <div class="mt-4">
                  <v-btn class="ma-2" color="blue" @click="loginGoogle">
                    <v-icon dark left> mdi-google </v-icon>Google
                  </v-btn>
                </div>
              </div>
            </template>
            <ValidationObserver v-slot="{ invalid }">
              <v-card-text class="text-center">
                <div class="text-center font-weight-light">Or Be Classical</div>

                <ValidationProvider
                  v-slot="{ errors }"
                  rules="email|required"
                  name="メールアドレス"
                >
                  <v-text-field
                    v-model="authValues.email"
                    color="secondary"
                    placeholder="Email..."
                    :error-messages="errors[0]"
                    :prepend-icon="
                      errors.length == 0 && authValues.email.length >= 1
                        ? 'mdi-email-outline'
                        : 'mdi-email-open'
                    "
                  />
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  rules="min:8|required"
                  name="パスワード"
                >
                  <v-text-field
                    v-model="authValues.password"
                    class="mb-8"
                    color="secondary"
                    placeholder="Password..."
                    :error-messages="errors[0]"
                    :prepend-icon="
                      errors.length == 0 && authValues.password.length >= 1
                        ? 'mdi-lock-outline'
                        : 'mdi-lock-off'
                    "
                    :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="isShowPassword ? 'text' : 'password'"
                    @click:append="isShowPassword = !isShowPassword"
                  />
                </ValidationProvider>

                <v-btn
                  :disabled="invalid"
                  color="accent"
                  rounded
                  text
                  large
                  @click="login"
                >
                  Let's Go
                </v-btn>
              </v-card-text>
            </ValidationObserver>
          </MaterialCard>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useRouter,
  useContext,
} from '@nuxtjs/composition-api'
import firebase from '~/plugins/firebase'
import { SnackbarStore } from '~/store'
import { Payload } from '~/store/snackbar'

export default defineComponent({
  layout: 'unProtected',
  setup() {
    const router = useRouter()
    const { $axios } = useContext()

    const authValues = reactive({
      email: '',
      password: '',
    })

    const isShowPassword = false

    let payload: Payload = { color: 'info', message: '' }

    const login = (): void => {
      window.$nuxt.$loading.start()
      firebase
        .auth()
        .signInWithEmailAndPassword(authValues.email, authValues.password)
        .then(() => {
          payload = { color: 'success', message: 'ログインに成功しました' }
          router.push('/')
        })
        .catch((e) => {
          switch (e.code) {
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
            default:
              payload = { color: 'error', message: '認証に失敗しました' }
              break
          }
        })
        .finally(() => {
          window.$nuxt.$loading.finish()
          SnackbarStore.visibleAction(payload)
        })
    }

    const loginGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (res) => {
          if (res.additionalUserInfo?.isNewUser) {
            window.$nuxt.$loading.start()

            const token = await res.user?.getIdToken()
            $axios.defaults.headers.common.Authorization = `Bearer ${token}`
            $axios
              .post('/api/v1/users', { user: { name: res.user?.displayName } })
              .then(() => {
                payload = { color: 'success', message: 'ユーザー登録に成功しました' }
                router.push('/')
              })
              .catch(() => {
                payload = { color: 'error', message: 'ユーザー作成に失敗しました' }
                const user = firebase.auth().currentUser
                user?.delete()
              })
              .finally(() => {
                window.$nuxt.$loading.finish()
                SnackbarStore.visibleAction(payload)
              })
          } else {
            payload = { color: 'success', message: 'ログインに成功しました' }
            router.push('/')
          }
        })
        .catch((e) => {
          switch (e.code) {
            case 'auth/popup-closed-by-user':
              payload = {
                color: 'warning',
                message: 'ログイン処理をキャンセルしました',
              }
              break
            default:
              payload = { color: 'error', message: 'ログインに失敗しました' }
              break
          }
        })
        .finally(() => {
          SnackbarStore.visibleAction(payload)
        })
    }

    return {
      authValues,
      isShowPassword,
      login,
      loginGoogle,
    }
  },
})
</script>
