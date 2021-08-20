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
                  <v-btn
                    class="my-2 mr-1"
                    dark
                    depressed
                    @click="signInAnonymouly"
                  >
                    かんたんログイン
                  </v-btn>

                  <div class="my-2" />

                  <div class="text-center text-h4">
                    or be Email and Password
                  </div>

                  <register-form
                    :name.sync="registerValues.name"
                    :email.sync="registerValues.email"
                    :password.sync="registerValues.password"
                    :passwordConfirm.sync="registerValues.passwordConfirm"
                    @registerHandle="emailAndPasswordRegister"
                  >
                  </register-form>
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
} from '@nuxtjs/composition-api'
import RegisterForm from '~/components/unProtected/RegisterForm.vue'

export default defineComponent({
  components: {
    RegisterForm,
  },
  layout: 'unProtected',
  setup() {
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

    const emailAndPasswordRegister = () => {
      import('~/utils/auth').then((module) => {
        module.emailAndPasswordRegister(registerValues)
      })
    }

    const signInAnonymouly = () => {
      import('~/utils/auth').then((module) => {
        module.signInAnonymouly()
      })
    }

    const isShowPassword = false
    const isShowDialog = false
    const isCheckToS = false

    return {
      sections,
      registerValues,
      emailAndPasswordRegister,
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
