<template>
  <v-row>
    <v-btn
      v-if="$device.isMobileOrTablet"
      dark
      @click="toggleVisibleAppBar"
      class="toggle-visible-appbar-btn"
      :color="isPlanActive ? 'primary' : ''"
      label
      style="border-radius: 0"
    >
      <v-icon v-if="isVisibleAppBar">mdi-arrow-collapse-up</v-icon>
      <v-icon v-else>mdi-arrow-expand-down</v-icon>
    </v-btn>

    <v-col max-width="100%" rounded cols="12" style="position: relative">
      <v-banner v-if="!hasActiveMap" color="info" icon="mdi-alert-circle-outline">マップが作成されていません</v-banner>

      <MapsGoogleMap v-show="hasActiveMap" />
      <SvgsBase v-show="hasActiveMap" />
    </v-col>

    <MapsFooterShow v-if="isPlanActive" style="position: absolute; bottom: 280px" />
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn @click="isVisibleMapDialog = true" absolute style="bottom: 200px" v-on="on"
          ><v-icon>mdi-map-legend</v-icon></v-btn
        >
      </template>
      <span>マップ切り替え</span>
    </v-tooltip>
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-show="isGoogleMap" @click="toggleMapMode" absolute style="bottom: 120px" v-on="on"
          ><v-icon>mdi-compare-horizontal</v-icon></v-btn
        >
      </template>
      <span>地図表示切り替え</span>
    </v-tooltip>

    <transition name="slide">
      <v-row v-show="isTodoListExpand" class="todolist-sideber" cols="12">
        <v-col cols="6">
          <MapsSideBarShow />
        </v-col>
        <v-col @pointerdown="isTodoListExpand = false" cols="6"></v-col>
      </v-row>
    </transition>

    <v-dialog v-model="isVisibleMapDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">マップ選択</span>
        </v-card-title>
        <v-card-text style="padding: 0">
          <MapsFooterBase :justify-content="'justify-center'" :is-spacer="true" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isVisibleMapDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
export default {
  layout: 'protected',

  middleware: ['initialize-store'],

  head: {
    title: 'Map Show',
  },
}
</script>

<script setup lang="ts">
import { PlansStore, MapsStore } from '~/store'
import { IsVisibleAppBarKey } from '~/types/injection-key'
import { isTodoListExpand } from '~/utils/ui/todolist-expand'

/** 計画のアクティブ判定。アクティブならマーカーとピン立てのスイッチを持つフッターを表示させる */
const isPlanActive = computed(() => PlansStore.currentPlan?.active)

/** マップが一件でもあるか。なければマップの代わりにバーを表示する */
const hasActiveMap = computed(() => !!MapsStore.activeMap)

/** モバイルかつ計画中でマップ閲覧画面にアクセスした際のappBar表示判定 */
const isVisibleAppBar = inject(IsVisibleAppBarKey)!

/** アプリバーの表示切り替えフラグ */
const toggleVisibleAppBar = () => {
  isVisibleAppBar.value = !isVisibleAppBar.value
}

/** マップ選択ダイアログ表示フラグ */
const isVisibleMapDialog = ref(false)

const { $googleMap } = useContext()
/** 航空写真と通常写真のトグル処理 */
const toggleMapMode = () => {
  const map = $googleMap.map.value
  if (!map) return

  const mapTypeId = map.getMapTypeId()
  const { ROADMAP, SATELLITE } = google.maps.MapTypeId
  mapTypeId === ROADMAP ? map.setMapTypeId(SATELLITE) : map.setMapTypeId(ROADMAP)
}

/** 現在表示しているマップがグーグルマップを使用するか */
const isGoogleMap = computed(() => !!MapsStore.activeMap?.isGoogleMap)
</script>

<style scoped lang="sass">
.toggle-visible-appbar-btn
  position: absolute
  left: 0
  top: 0
  z-index: 2
  border-radius: 0
  clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%)

.todolist-sideber
  position: fixed
  inset: 0
  width: 100%
  height: 100%
  z-index: 3
  background-color: rgba(0,0,0, .4)

.slide-enter
  transform: translateX(-50%)

.slide-enter-active, .slide-leave-active
  transition: all .3s

.slide-enter-to
  transform: translateX(0)

.slide-leave-to
  transform: translateX(-50%)
</style>
