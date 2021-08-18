<template>
  <v-row>
    <v-btn @click="healthCheckApi"> health check </v-btn>
  </v-row>
</template>

<script type="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $axios, $config } = useContext()

    // apiとserverMiddlewareの疎通確認
    const healthCheckApi = () => {
      window.$nuxt.$loading.start()
      $axios.$get('/health-check')
      .then(res => console.log(res))
      $axios.$get(`${$config.serverMiddlewareURL}/health-check`)
      .then(res => console.log(res))
      window.$nuxt.$loading.finish()
    }

    return { healthCheckApi }
  }
})
</script>
