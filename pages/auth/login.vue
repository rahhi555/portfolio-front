<template>
  <v-container id="login-view" class="fill-height" tag="section">
    <v-row justify="center">
      <v-col cols="12">
        <v-slide-y-transition appear>
          <MaterialCard light max-width="350" rounded class="mx-auto" color="accent" full-header>
            <template #heading>
              <div class="text-center pa-5">
                <div class="text-h4 font-weight-bold white--text">Login</div>
                <div class="mt-4">
                  <v-btn class="ma-2" color="blue" @click="googleLogin">
                    <v-icon dark left> mdi-google </v-icon>Google
                  </v-btn>
                </div>
              </div>
            </template>
            <ValidationObserver v-slot="{ invalid }">
              <v-card-text class="text-center">
                <div class="text-center font-weight-light">Or Be Classical</div>

                <ValidationProvider v-slot="{ errors }" rules="email|required" name="メールアドレス">
                  <v-text-field
                    v-model="authValues.email"
                    class="email-form"
                    color="secondary"
                    placeholder="Email..."
                    :error-messages="errors[0]"
                    :prepend-icon="
                      errors.length == 0 && authValues.email.length >= 1 ? 'mdi-email-outline' : 'mdi-email-open'
                    "
                  />
                </ValidationProvider>

                <ValidationProvider v-slot="{ errors }" rules="min:8|required" name="パスワード">
                  <v-text-field
                    v-model="authValues.password"
                    class="mb-6 password-form"
                    color="secondary"
                    placeholder="Password..."
                    :error-messages="errors[0]"
                    :prepend-icon="
                      errors.length == 0 && authValues.password.length >= 1 ? 'mdi-lock-outline' : 'mdi-lock-off'
                    "
                    :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="isShowPassword ? 'text' : 'password'"
                    @click:append="isShowPassword = !isShowPassword"
                  />
                </ValidationProvider>

                <v-btn
                  :disabled="invalid"
                  class="login-button"
                  color="accent"
                  rounded
                  text
                  large
                  @click="emailAndPasswordLogin"
                >
                  Let's Go
                </v-btn>

                <v-spacer />

                <v-dialog v-model="isVisiblePasswordResetModal" max-width="500">
                  <template #activator="{ on, attrs }">
                    <v-chip class="my-4" small v-bind="attrs" v-on="on">
                      <v-icon left> mdi-information-outline </v-icon>
                      パスワードを忘れた方
                    </v-chip>
                  </template>

                  <material-card
                    icon="mdi-email-outline"
                    icon-small
                    title="パスワード再設定リクエスト送信"
                    color="accent"
                  >
                    <v-card-text>
                      <v-form>
                        <v-text-field
                          v-model="passwordResetEmail"
                          class="mb-5"
                          label="Email..."
                          hint="登録中のメールアドレスを入力して「送信」ボタンをクリックしてください。
                                パスワードの再設定のメールが届きますので、メールに記載の指示に従ってください。"
                          persistent-hint
                        />
                      </v-form>

                      <v-btn @click="isVisiblePasswordResetModal = false"> キャンセル </v-btn>
                      <v-btn color="accent" min-width="80" @click="sendPasswordResetEmail"> 送信 </v-btn>
                    </v-card-text>
                  </material-card>
                </v-dialog>

                <v-chip small>
                  <v-icon left> mdi-email-edit-outline </v-icon>
                  <a
                    href="mailto:whowhose0904@gmail.com?subject=問い合わせ&amp;body=お問い合わせ内容をご記入ください"
                    style="color: #333; text-decoration: none"
                    >お問い合わせメールはこちら</a
                  >
                </v-chip>
              </v-card-text>
            </ValidationObserver>
          </MaterialCard>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  head: {
    title: 'Login',
  },
}
</script>

<script setup lang="ts">
const { $auth } = useContext()

const authValues = reactive({
  email: '',
  password: '',
})

const isShowPassword = false

const emailAndPasswordLogin = (): void => {
  $auth.emailAndPasswordLogin(authValues)
}

const googleLogin = (): void => {
  $auth.googleLogin()
}

const isVisiblePasswordResetModal = ref(false)
const passwordResetEmail = ref('')
const sendPasswordResetEmail = () => {
  if (!confirm('メールを送信してもよろしいですか？')) return

  isVisiblePasswordResetModal.value = false
  $auth.sendPasswordResetEmail(passwordResetEmail.value)
  passwordResetEmail.value = ''
}
</script>
