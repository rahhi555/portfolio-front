<template>
  <v-row>
    <client-only>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3">
        <MapsSideBarShow />
      </v-col>
    </client-only>

    <v-col max-width="100%" rounded cols="12" md="9" style="position: relative">
      <MapsGoogleMap v-show="hasActiveMap" />
      <SvgsBase v-show="hasActiveMap" />
      <MapsFooterBase
        :justify-content="
          isPlanActive ? 'justify-sm-space-between' : 'justify-end'
        "
      >
        <MapsFooterShow v-if="isPlanActive" />
      </MapsFooterBase>
    </v-col>

    <client-only>
      <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" md="3">
        <MapsSideBarShow />
      </v-col>
    </client-only>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
} from '@nuxtjs/composition-api'
import { PlansStore, MapsStore } from '~/store'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    return {}
  },

  computed: {
    isPlanActive() {
      return PlansStore.currentPlan?.active
    },
    hasActiveMap() {
      return !!MapsStore.activeMap
    }
  },
})
</script>
