<template>
  <v-container id="register-view" class="fill-height" tag="section">
    <v-row justify="center">
      <v-col cols="12" md="9">
        <v-slide-y-transition appear>
          <v-card class="pa-3 pa-md-10 mx-sm-auto" light>
            <h1 class="text-center text-h2 font-weight-light">Register</h1>

            <v-row>
              <v-col cols="12" md="6">
                <v-row no-gutters>
                  <v-col v-for="(section, i) in sections" :key="i" cols="12">
                    <v-list-item three-line>
                      <v-list-item-icon class="mr-4 mt-5 mt-md-4">
                        <v-icon
                          :color="section.iconColor"
                          :large="$vuetify.breakpoint.mdAndUp"
                          v-text="section.icon"
                        />
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title
                          class="text-h4 mb-4 mt-3"
                          v-text="section.title"
                        />

                        <v-list-item-subtitle
                          class="text--secondary"
                          v-text="section.text"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-center">
                  <v-btn class="my-2 mr-1" dark depressed @click="signInAnonymouly">
                    かんたんログイン
                  </v-btn>

                  <div class="my-2" />

                  <div class="text-center text-h4">
                    or be Email and Password
                  </div>

                  <ValidationObserver v-slot="{ invalid }">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="max:50|required"
                      name="名前"
                    >
                      <v-text-field
                        v-model="registerValues.name"
                        color="secondary"
                        placeholder="Nick Name..."
                        :prepend-icon="
                          errors.length == 0 && registerValues.name.length >= 1
                            ? 'mdi-emoticon-kiss-outline'
                            : 'mdi-emoticon-neutral'
                        "
                        required
                        :error-messages="errors[0]"
                        counter="50"
                      />
                    </ValidationProvider>

                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="email|required"
                      name="メールアドレス"
                    >
                      <v-text-field
                        v-model="registerValues.email"
                        color="secondary"
                        placeholder="Email..."
                        :prepend-icon="
                          errors.length == 0 && registerValues.email.length >= 1
                            ? 'mdi-email-outline'
                            : 'mdi-email-open'
                        "
                        required
                        :error-messages="errors[0]"
                      />
                    </ValidationProvider>

                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="min:8|required|alpha_dash"
                      name="パスワード"
                    >
                      <v-text-field
                        v-model="registerValues.password"
                        color="secondary"
                        placeholder="Password..."
                        :prepend-icon="
                          errors.length == 0 &&
                          registerValues.password.length >= 1
                            ? 'mdi-lock-outline'
                            : 'mdi-lock-off'
                        "
                        :append-icon="
                          isShowPassword ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        :type="isShowPassword ? 'text' : 'password'"
                        :error-messages="errors[0]"
                        required
                        counter
                        @click:append="isShowPassword = !isShowPassword"
                      />
                    </ValidationProvider>

                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="password:@パスワード"
                      name="パスワード(確認)"
                    >
                      <v-text-field
                        v-model="registerValues.passwordConfirm"
                        color="secondary"
                        placeholder="Password Confirm..."
                        :prepend-icon="
                          errors.length == 0 &&
                          registerValues.passwordConfirm.length >= 1
                            ? 'mdi-lock-check-outline'
                            : 'mdi-lock-off'
                        "
                        :type="isShowPassword ? 'text' : 'password'"
                        :error-messages="errors[0]"
                        required
                      />
                    </ValidationProvider>

                    <ValidationProvider
                      v-slot="{ errors }"
                      :rules="{ required: 0 }"
                      name="利用規約"
                    >
                      <v-checkbox
                        v-model="isCheckToS"
                        color="secondary"
                        :error-messages="errors[0]"
                      >
                        <template #label>
                          <v-dialog v-model="isShowDialog" width="800">
                            <template v-slot:activator="{ on, attrs }">
                              <a
                                class="
                                  secondary--text
                                  ml-6 ml-sm-1
                                  d-inline-block
                                "
                                href="#"
                                v-bind="attrs"
                                v-on="on"
                              >
                                利用規約
                              </a>
                            </template>
                            <TearmsOfService></TearmsOfService>
                          </v-dialog>

                          <span class="text-no-wrap">に同意します</span>
                        </template>
                      </v-checkbox>
                    </ValidationProvider>

                    <v-btn
                      color="secondary"
                      depressed
                      min-width="140"
                      rounded
                      :disabled="invalid"
                      @click="EmailAndPasswordRegister"
                    >
                      Get Started
                    </v-btn>
                  </ValidationObserver>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
import firebase from '~/plugins/firebase'
import TearmsOfService from '~/components/unProtected/TermsOfService.vue'
import { SnackbarStore } from '~/store'
import { Payload } from '~/store/snackbar'

export default defineComponent({
  components: {
    TearmsOfService,
  },
  layout: 'unProtected',
  setup() {
    const { $axios } = useContext()
    const router = useRouter()

    const sections = [
      {
        icon: 'mdi-map',
        iconColor: 'primary',
        title: '簡単に平面図を作成',
        text: '使用する図形は長方形のみ！細かい設定が無くシンプルなので、サクッと平面図を作成できます。',
      },
      {
        icon: 'mdi-calendar-check',
        iconColor: 'secondary',
        title: '平面図とタスクをリンク',
        text: '作成した平面図にタスクを設定することができ、進行状況を視覚的に共有することができます。',
      },
      {
        icon: 'mdi-comment-flash',
        iconColor: 'cyan',
        title: '高いリアルタイム性',
        text: 'タスクはリアルタイムに通知され、さらにピン立てやマーカーを引くことも可能です。',
      },
    ]

    const registerValues = reactive({
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    })

    let payload: Payload = { color: 'info', message: '' }

    const EmailAndPasswordRegister = (): void => {
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
          $axios
            .post('/api/v1/users', { user: { name: registerValues.name } })
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
        })
        .catch((e) => {
          switch (e.code) {
            case 'auth/email-already-in-use':
              payload = { color: 'error', message: 'すでにそのメールアドレスは使用されています' }
              break
            default:
              payload = { color: 'error', message: 'ユーザー登録に失敗しました' }
              break
          }
          window.$nuxt.$loading.finish()
          SnackbarStore.visibleAction(payload)
        })
    }

    const signInAnonymouly = () => {
      window.$nuxt.$loading.start()
      firebase.auth().signInAnonymously()
        .then(() => {
          payload = { color: 'success', message: '匿名ユーザーとしてログインしました' }
          router.push('/')
        })
        .catch(() => {
          payload = { color: 'error', message: 'ログインに失敗しました' }
        })
        .finally(() => {
          window.$nuxt.$loading.finish()
          SnackbarStore.visibleAction(payload)
        })
    }

    const isShowPassword = false
    const isShowDialog = false
    const isCheckToS = false

    return {
      sections,
      registerValues,
      EmailAndPasswordRegister,
      signInAnonymouly,
      isShowPassword,
      isShowDialog,
      isCheckToS,
    }
  },
})
</script>

<style scoped lang="sass">
#register-view
  .v-list-item__subtitle
    -webkic-line-clamp: initial
    -webkit-box-orient: initial

  .v-list-item__title
    font-size: 1.12rem

  .v-list-item__subtitle
    font-size: .875rem
    color: #3C4858
    line-height: 1.5em
    font-weight: 300
</style>
