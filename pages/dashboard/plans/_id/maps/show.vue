<template>
  <v-row>
    <client-only>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3">
        <map-show-side-bar></map-show-side-bar>
      </v-col>
    </client-only>

    <v-col max-width="100%" rounded cols="12" md="9">
      <map-show></map-show>
    </v-col>

    <client-only>
      <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" md="3">
        <map-show-side-bar></map-show-side-bar>
      </v-col>
    </client-only>

    <map-page :justify-content="'justify-end'"></map-page>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import MapShow from '~/components/protected/maps/MapShow.vue'
import MapPage from '~/components/protected/maps/MapPage.vue'
import MapShowSideBar from '~/components/protected/maps/MapShowSideBar.vue'


export default defineComponent({
  components: {
    MapShow,
    MapPage,
    MapShowSideBar
  },

  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    return {}
  },
})
</script>