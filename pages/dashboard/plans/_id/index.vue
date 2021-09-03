<template >
  <v-row>
    <v-col max-width="100%" rounded>
      <map-base></map-base>
    </v-col>
    
  </v-row>
</template>

<script lang="ts">
import { defineComponent, useFetch } from '@nuxtjs/composition-api'
import { PlansStore } from '~/store'
import MapBase from '~/components/protected/maps/MapBase.vue'

export default defineComponent({
  components: {
    MapBase,
  },

  layout: 'protected',

  setup() {
    useFetch( async ({ $route }) => {
      const planId = $route.params.id
      await PlansStore.setPlan(planId)
    })

    return {
    }
  },
})
</script>
