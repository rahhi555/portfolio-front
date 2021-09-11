<template >
  <v-row>
    <v-col max-width="100%" rounded>
      <map-base></map-base>
    </v-col>
    
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import MapBase from '~/components/protected/maps/MapBase.vue'

export default defineComponent({
  components: {
    MapBase,
  },

  layout: 'protected',  

  middleware: [
    'initialize-store'
  ],

  setup() {
    return {
    }
  },
})
</script>
