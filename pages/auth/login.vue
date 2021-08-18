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
                  <v-btn class="ma-2" color="blue">
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

                <v-btn :disabled="invalid" color="accent" rounded text large @click="login">
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
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import firebase from '~/plugins/firebase'

export default defineComponent({
  layout: 'unProtected',
  setup(){
    const router = useRouter()

    const authValues = reactive({
      email: '',
      password: '',
    })

    const isShowPassword = false

    const login = (): void => {
      window.$nuxt.$loading.start()
      firebase
        .auth()
        .signInWithEmailAndPassword(authValues.email, authValues.password)
        .then(() => {
          router.push('/')
        })
        .finally(() => {
          window.$nuxt.$loading.finish()
        })
    }

    return {
      authValues,
      isShowPassword,
      login
    }
  }
})
</script>
