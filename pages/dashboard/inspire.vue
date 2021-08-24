<template>
  <v-row>
    <v-btn @click="healthCheckApi"> health check </v-btn>
    <v-btn @click="me"> me </v-btn>
  </v-row>
</template>

<script type="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'protected',

  setup() {
    const { $axios, $config, $auth } = useContext()

    // apiとserverMiddlewareの疎通確認
    const healthCheckApi = () => {
      window.$nuxt.$loading.start()
      $axios.$get('/health-check')
      .then(res => console.log(res))
      $axios.$get(`${$config.axios.serverMiddlewareURL}/health-check`)
      .then(res => console.log(res))
      window.$nuxt.$loading.finish()
    }

    const me = () => {
      $auth.emailAndPasswordRegister()
    }

    return { healthCheckApi, me }
  }
})
</script>
