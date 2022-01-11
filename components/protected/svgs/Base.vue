<template>
  <v-sheet
    ref="svgSheet"
    elevation="6"
    :class="['svg-base-sheet', { 'svg-base-sheet-expand': isShowPage }]"
    data-tutorial="drag-and-save-rect click-rect"
    @touchmove="pinchInOut"
  >
    <svg
      v-show="!isGoogleMapEditMode"
      id="svg-base"
      :class="{ 'mysvg-edit': isEditPage }"
      width="100%"
      height="100%"
      :viewBox="viewBoxStr().value"
      xmlns="http://www.w3.org/2000/svg"
      style="border: solid 2px black"
      @pointerdown.left="
        addPath($event);
        addPolylineStart($event)
        scrollBegin($event)
      "
      @pointermove="
        scrollMiddle($event);
        dragMiddle($event)
        resizeMiddle($event)
        addPolylineMiddle($event)
      "
      @pointerup="
        scrollEnd();
        dragStop()
        resizeStop()
        addPolylineStop()
      "
      @wheel.prevent="zoomInOut"
    >
      <SvgsRect v-for="rect in rects" :key="rect.id" :rect="rect"></SvgsRect>

      <SvgsPath v-for="path in paths" :key="path.id" :path="path"></SvgsPath>

      <SvgsPolyline v-for="polyline in polylines" :key="polyline.id" :polyline="polyline"></SvgsPolyline>
    </svg>

    <slot></slot>

    <v-tooltip v-if="!isGoogleMapEditMode && activeMapDisabledGoogleMap" top>
      <template #activator="{ on, attrs }">
        <v-icon class="zoom-chip" large v-bind="attrs" @click="reset" v-on="on">mdi-magnify-remove-outline</v-icon>
      </template>
      <span>表示リセット</span>
    </v-tooltip>

    <client-only>
      <v-tooltip v-if="!isGoogleMapEditMode && isEditPage" top>
        <template #activator="{ on, attrs }">
          <v-icon class="save-icon" large v-bind="attrs" @click="save" v-on="on">mdi-content-save</v-icon>
        </template>
        <span>セーブ</span>
      </v-tooltip>
    </client-only>

    <SvgsContextMenu></SvgsContextMenu>
  </v-sheet>
</template>

<script setup lang="ts">
import { debounce } from 'mabiki'
import { MapsStore, SvgsStore } from '~/store'
import {
  svgSheet,
  setup as viewBoxSetup,
  scrollBegin,
  scrollEnd,
  scrollMiddle,
  viewBoxStr,
  zoomInOut,
  reset,
} from '~/utils/svgs/svg-viewbox'
import { setup as spaceKeySetup } from '~/utils/helpers/add-event-space-press'
import { dragMiddle, dragStop } from '~/utils/svgs/svg-drag'
import { resizeMiddle, resizeStop } from '~/utils/svgs/svg-resize'
import { addPath } from '~/utils/svgs/svg-add-path'
import { addPolylineStart, addPolylineMiddle, addPolylineStop } from '~/utils/svgs/svg-add-polyline'
import { setup as cursorSetup } from '~/utils/ui/svg-cursor'
import { isEditPage, isShowPage } from '~/utils/ui/common'
import { pinchInOut } from '~/utils/svgs/svg-pinch'

const rects = computed(() => SvgsStore.activeMapSvgs('Rect'))
const paths = computed(() => SvgsStore.activeMapSvgs('Path'))
const polylines = computed(() => SvgsStore.activeMapSvgs('Polyline'))

viewBoxSetup()
spaceKeySetup()
cursorSetup()

const { $googleMap, $tutorial } = useContext()
// 編集ページかつGoogleMap編集ページかどうか
const isGoogleMapEditMode = computed(() => isEditPage.value && $googleMap.isGoogleMapEditMode.value)
// 現在マップのgoogleMapが無効かどうか(isGoogleMapがfalseか)
const activeMapDisabledGoogleMap = computed(() => {
  if (!MapsStore.activeMap) return false
  return !MapsStore.activeMap.isGoogleMap
})

// オートセーブ
const autosave = debounce(
  function () {
    SvgsStore.updateSvgs()
  },
  3000,
  { maxWait: 30000 }
)
const allSvgs = computed(() => {
  return SvgsStore.allSvgs
})
const autoSaveStop = watch(
  allSvgs,
  () => {
    if (isEditPage.value && !$tutorial.isRunningTutorial.value) autosave()
  },
  { deep: true }
)
onUnmounted(autoSaveStop)

/** 手動セーブ */
const save = () => {
  if ($tutorial.isRunningTutorial.value) return
  SvgsStore.updateSvgs()
}
</script>

<style scoped lang="sass">
.svg-base-sheet
  height: map-get($svgbase-and-googlemap-vh, 'default')
  touch-action: none
  background-color: transparent
  user-select: none

.svg-base-sheet-expand
  height: map-get($svgbase-and-googlemap-vh, 'expand')

.mysvg-edit
  background-image: linear-gradient(90deg, transparent 19px, #A9A9A9 20px), linear-gradient(0deg, transparent 19px, #A9A9A9 20px)
  background-size: 20px 20px
  background-repeat: repeat

.pointer
  cursor: pointer

.move
  cursor: move

.zoom-chip
  position: absolute
  bottom: 80px
  right: 70px

.save-icon
  position: absolute
  bottom: 80px
  right: 30px
</style>
