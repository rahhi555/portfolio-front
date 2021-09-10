<template >
  <v-row>
    <v-col max-width="100%" rounded>
      <map-base></map-base>
    </v-col>
    
  </v-row>
</template>

<script lang="ts">
import { defineComponent, useFetch } from '@nuxtjs/composition-api'
import { initializeStore } from '~/utils/helpers/store_helpers'
import MapBase from '~/components/protected/maps/MapBase.vue'

export default defineComponent({
  components: {
    MapBase,
  },

  layout: 'protected',  

  setup() {
    useFetch( async ({ $route }) => {
      const planId = $route.params.id
      await initializeStore(planId)
    })

    return {
    }
  },
})
</script>
