<template>
  <v-row>
    <v-col max-width="100%" rounded cols="12">
      <map-show></map-show>
    </v-col>

    <map-page :justify-content="'justify-end'"></map-page>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import MapShow from '~/components/protected/maps/MapShow.vue'
import MapPage from '~/components/protected/maps/MapPage.vue'

export default defineComponent({
  components: {
    MapShow,
    MapPage
  },

  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    return {}
  },
})
</script>