<template>
  <v-row>
    <client-only>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3">
        <MapsSideBarShow />
      </v-col>
    </client-only>

    <v-icon v-if="$vuetify.breakpoint.smAndDown" class="scroll-icon scroll-icon-top" x-large @click="scrollBottom"
      >mdi-arrow-down-drop-circle-outline</v-icon
    >
    <v-icon v-if="$vuetify.breakpoint.smAndDown" class="scroll-icon scroll-icon-bottom" x-large @click="scrollTop"
      >mdi-arrow-up-drop-circle-outline</v-icon
    >

    <v-col max-width="100%" rounded cols="12" md="9" style="position: relative">
      <MapsGoogleMap v-show="hasActiveMap" />
      <SvgsBase v-show="hasActiveMap" />
      <MapsFooterBase :justify-content="isPlanActive ? 'justify-sm-space-between' : 'justify-end'">
        <MapsFooterShow v-if="isPlanActive" />
      </MapsFooterBase>
    </v-col>

    <client-only>
      <v-col v-if="$vuetify.breakpoint.smAndDown" id="bottom-sidebar" cols="12" md="3">
        <MapsSideBarShow />
      </v-col>
    </client-only>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { PlansStore, MapsStore } from '~/store'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    const scrollBottom = () => {
      scrollTo(0, 99999999999)
    }

    const scrollTop = () => {
      scrollTo(0, 0)
    }

    return {
      scrollBottom,
      scrollTop,
    }
  },

  computed: {
    isPlanActive() {
      return PlansStore.currentPlan?.active
    },
    hasActiveMap() {
      return !!MapsStore.activeMap
    },
  },
})
</script>
<style scoped lang="sass">
.scroll-icon
  position: absolute
  left: 0
  color: white
  border-radius: 100%
  box-shadow: 0px 10px 10px -5px rgba(0,0,0,0.8)

.scroll-icon-top
  top: 0

.scroll-icon-bottom
  bottom: 0
</style>
