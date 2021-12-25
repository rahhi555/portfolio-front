<template>
  <v-row>
    <client-only>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3">
        <MapsSideBarShow />
      </v-col>
    </client-only>

    <client-only>
      <v-chip v-if="isSmAndDownWithPlanShow" dark @click="toggleVisibleAppBar" class="toggle-visible-appbar-btn" label>
        <v-icon v-if="isVisibleAppBar">mdi-arrow-collapse-up</v-icon>
        <v-icon v-else>mdi-arrow-expand-down</v-icon>
      </v-chip>
    </client-only>

    <v-col max-width="100%" rounded cols="12" md="9" style="position: relative; padding-right: 0;">
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
export default {
  layout: 'protected',

  middleware: ['initialize-store'],

  head: {
    title: 'Map Show'
  }
}
</script>

<script setup lang="ts">
import { PlansStore, MapsStore } from '~/store'
import { IsVisibleAppBarKey } from '~/types/injection-key'
import { isSmAndDownWithPlanShow } from '~/utils/ui/common'

/** 計画のアクティブ判定。アクティブならマーカーとピン立てのスイッチを持つフッターを表示させる */
const isPlanActive = computed(() => PlansStore.currentPlan?.active)

/** マップが一件でもあるか。なければマップの代わりにバーを表示する */
const hasActiveMap = computed(() => !!MapsStore.activeMap)

/** モバイルかつ計画中でマップ閲覧画面にアクセスした際のappBar表示判定 */
const isVisibleAppBar = inject(IsVisibleAppBarKey)!

const toggleVisibleAppBar = () => {
  isVisibleAppBar.value = !isVisibleAppBar.value
}
</script>

<style scoped lang="sass">
.toggle-visible-appbar-btn
  position: absolute
  left: 0
  top: 0
  z-index: 1
</style>
