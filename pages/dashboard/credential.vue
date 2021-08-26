<template>
  <material-card
    icon-small
    color="accent"
    icon="mdi-mail"
    title="本アカウント登録"
  >
    
    <v-card-subtitle class="my-3 mb-1 pb-0">Googleアカウントで登録</v-card-subtitle>
    <v-btn class="ml-2" color="blue" @click="googleCredential">
      <v-icon color="white" left> mdi-google </v-icon
      ><span class="white--text">Google</span>
    </v-btn>

    <v-card-subtitle class="my-3 mb-0 pb-0">メールアドレスで登録</v-card-subtitle>
    <v-card-text class="my-0">
      <v-form>
        <register-form
          :name.sync="registerValues.name"
          :email.sync="registerValues.email"
          :password.sync="registerValues.password"
          :password-confirm.sync="registerValues.passwordConfirm"
          @registerHandle="emailAndPasswordCredential"
        >
        </register-form>
      </v-form>
    </v-card-text>
  </material-card>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import RegisterForm from '~/components/default/RegisterForm.vue'

export default defineComponent({
  components: {
    RegisterForm,
  },

  layout: 'protected',

  setup() {
    const { $auth } = useContext()

    const registerValues = reactive({
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    })

    const emailAndPasswordCredential = () => {
      $auth.emailAndPasswordCredential(registerValues)
    }

    const googleCredential = () => {
      $auth.googleCredential()
    }

    return {
      registerValues,
      emailAndPasswordCredential,
      googleCredential
    }
  },
})
</script>
