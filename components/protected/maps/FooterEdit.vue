<template>
  <v-row align="center">
    <v-btn-toggle v-model="selected" dense>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn :disabled="isGoogleMapEditMode" data-tutorial="add-rect" @click="addRect">
            <v-icon large v-bind="attrs" v-on="on">mdi-rectangle-outline</v-icon>
          </v-btn>
        </template>
        <span>四角形</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn :disabled="isGoogleMapEditMode">
            <v-icon large v-bind="attrs" v-on="on">mdi-map-marker</v-icon>
          </v-btn>
        </template>
        <span>ピン</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn :disabled="isGoogleMapEditMode">
            <v-icon large v-bind="attrs" v-on="on">mdi-marker</v-icon>
          </v-btn>
        </template>
        <span>マーカー</span>
      </v-tooltip>
    </v-btn-toggle>

    <v-row v-if="enabledGoogleMap" align="center" class="ml-4" data-tutorial="change-google-map-mode">
      <v-switch v-model="isGoogleMapEditMode"></v-switch>
      <span :class="['switch-text', { 'active-mode': !isGoogleMapEditMode }]">ミニマップ</span>
      <span class="switch-text">/</span>
      <span :class="['switch-text', { 'active-mode': isGoogleMapEditMode }]">グーグルマップ</span>
    </v-row>
  </v-row>
</template>

<script setup lang="ts">
import { MapsStore, SvgsStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'
import { isAddPathMode } from '~/utils/svgs/svg-add-path'
import { isAddPolylineMode } from '~/utils/svgs/svg-add-polyline'

const selected = ref<number | undefined>(undefined)
watch(selected, () => {
  switch (selected.value) {
    case 0:
      selected.value = undefined
      isAddPathMode.value = false
      isAddPolylineMode.value = false
      break
    case 1:
      isAddPathMode.value = true
      isAddPolylineMode.value = false
      break
    case 2:
      isAddPathMode.value = false
      isAddPolylineMode.value = true
      break
    default:
      isAddPathMode.value = false
      isAddPolylineMode.value = false
      break
  }
})

const { $googleMap, $tutorial } = useContext()

const addRect = () => {
  if ($tutorial.isRunningTutorial.value) return

  const rect: SvgParams = {
    type: 'Rect',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    name: 'new Rect',
  }
  SvgsStore.addSvg(rect)
}

const enabledGoogleMap = computed(() => {
  return !!MapsStore.activeMap && MapsStore.activeMap.isGoogleMap
})

const isGoogleMapEditMode = $googleMap.isGoogleMapEditMode
</script>

<style scoped lang="sass">
.switch-text
  color: gray

.active-mode
  color: white
  font-weight: bold
</style>
