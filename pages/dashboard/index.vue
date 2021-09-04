<template>
  <v-row>
    <v-btn @click="healthCheckApi"> health check </v-btn>
    <v-btn @click="me"> me </v-btn>
  </v-row>
</template>

<script type="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import firebase from '~/plugins/firebase'

export default defineComponent({
  layout: 'protected',

  setup() {
    const { $axios, $config } = useContext()

    // apiとserverMiddlewareの疎通確認
    const healthCheckApi = () => {
      window.$nuxt.$loading.start()
      $axios.$get('/health-check')
      .then(res => console.log(res))
      $axios.$get(`${$config.axios.serverMiddlewareURL}/health-check`)
      .then(res => console.log(res))
      window.$nuxt.$loading.finish()
    }

    const me = async () => {
      console.log(firebase.auth().currentUser)
      console.log($axios.defaults.headers.common)
      await $axios.$get('/api/v1/me').then(res => {
        console.log(res)
      }).catch(e => {
        console.error(e)
      })

      $axios.$get('api/v1/roles').then(res => {
        console.log(res)
      }).catch(e => {
        console.error(e)
      })
    }

    return { healthCheckApi, me }
  }
})
</script>
