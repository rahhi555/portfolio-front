<template>
  <v-sheet ref="svgSheet" elevation="6" class="svg-base-sheet">
    <svg
      v-show="!isGoogleMapEditMode"
      id="svg-base"
      :class="{ 'mysvg-edit': isEditPage }"
      width="100%"
      height="100%"
      :viewBox="viewBoxStr"
      xmlns="http://www.w3.org/2000/svg"
      style="border: solid 2px black;"
      @pointerdown.left="
        scrollBegin($event)
        addPath($event)
        addPolylineStart($event)
      "
      @pointermove="
        scrollMiddle($event)
        dragMiddle($event)
        resizeMiddle($event)
        addPolylineMiddle($event)
      "
      @pointerup="
        scrollEnd()
        dragStop()
        resizeStop()
        addPolylineStop()
      "
      @wheel.prevent="zoomInOut"
    >
      <SvgsRect v-for="rect in rects" :key="rect.id" :rect="rect"></SvgsRect>

      <SvgsPath v-for="path in paths" :key="path.id" :path="path"></SvgsPath>

      <SvgsPolyline
        v-for="polyline in polylines"
        :key="polyline.id"
        :polyline="polyline"
      ></SvgsPolyline>
    </svg>

    <slot></slot>

    <v-chip v-show="!$device.isDesktop" class="zoom-chip">
      <v-icon class="mr-3" @click="zoomInOut({ deltaY: 1 })"
        >mdi-magnify-plus-outline</v-icon
      >
      <v-icon class="ml-3" @click="zoomInOut({ deltaY: -1 })"
        >mdi-magnify-minus-outline</v-icon
      >
    </v-chip>

    <v-tooltip v-if="!isGoogleMapEditMode && activeMapDisabledGoogleMap" top>
      <template #activator="{ on, attrs }">
        <v-icon class="zoom-chip" large v-bind="attrs" @click="reset" v-on="on"
          >mdi-magnify-remove-outline</v-icon
        >
      </template>
      <span>表示リセット</span>
    </v-tooltip>

    <v-tooltip v-if="!isGoogleMapEditMode && isEditPage" top>
      <template #activator="{ on, attrs }">
        <v-icon class="save-icon" large v-bind="attrs" @click="save" v-on="on"
          >mdi-content-save</v-icon
        >
      </template>
      <span>セーブ</span>
    </v-tooltip>

    <SvgsContextMenu></SvgsContextMenu>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  useContext,
} from '@nuxtjs/composition-api'
import { debounce } from 'mabiki'
import { MapsStore, SvgsStore } from '~/store'
import ViewBox from '~/utils/svgs/svg-viewbox'
import SpaceKey from '~/utils/helpers/add-event-space-press'
import Drag from '~/utils/svgs/svg-drag'
import Resize from '~/utils/svgs/svg-resize'
import Path from '~/utils/svgs/svg-add-path'
import Polyline from '~/utils/svgs/svg-add-polyline'
import Cursor from '~/utils/ui/svg-cursor'
import CommonUI from '~/utils/ui/common'

export default defineComponent({
  setup() {
    const rects = computed(() => SvgsStore.activeMapSvgs('Rect'))
    const paths = computed(() => SvgsStore.activeMapSvgs('Path'))
    const polylines = computed(() => SvgsStore.activeMapSvgs('Polyline'))

    ViewBox.mounted()
    SpaceKey.mounted()
    SpaceKey.unMounted()
    Cursor.mounted()

    // 現在のページが編集ページかどうか
    const isEditPage = CommonUI.isEditPage
    
    const { $googleMap } = useContext()
    // 編集ページかつGoogleMap編集ページかどうか
    const isGoogleMapEditMode = computed(
      () => isEditPage.value && $googleMap.isGoogleMapEditMode.value
    )
    // 現在マップのgoogleMapが無効かどうか(isGoogleMapがfalseか)
    const activeMapDisabledGoogleMap = computed(() => { 
      if(!MapsStore.activeMap) return false
      return !MapsStore.activeMap.isGoogleMap
    })

    // viewBox操作
    const scrollBegin = (e: MouseEvent) => {
      // editページはスペースキーを押下する必要あり
      if (!SpaceKey.isSpaceKeyPress.value && isEditPage.value) return
      // 挿入モード中はスペースキーを押下する必要あり
      if (!SpaceKey.isSpaceKeyPress.value && Cursor.isAddModes.value) return
      ViewBox.scrollBegin(e)
    }

    // オートセーブ
    const autosave = debounce(
      function () {
        SvgsStore.updateSvgs()
      },
      3000,
      { maxWait: 30000 }
    )
    watch(SvgsStore.allSvgs, () => autosave())

    return {
      rects,
      paths,
      polylines,

      svgSheet: ViewBox.svgSheet,
      viewBoxStr: ViewBox.viewBoxStr(),

      addPath: (e: PointerEvent) => Path.addPath(e),

      addPolylineStart: (e: PointerEvent) => Polyline.addPolylineStart(e),
      addPolylineMiddle: (e: PointerEvent) => Polyline.addPolylineModeMiddle(e),
      addPolylineStop: () => Polyline.addPolylineStop(),

      scrollBegin,
      scrollMiddle: (e: MouseEvent) => ViewBox.scrollMiddle(e),
      scrollEnd: () => ViewBox.scrollEnd(),

      dragMiddle: (e: PointerEvent) => Drag.dragMiddle(e),
      dragStop: () => Drag.dragStop(),

      resizeMiddle: (e: PointerEvent) => Resize.resizeMiddle(e),
      resizeStop: () => Resize.resizeStop(),

      zoomInOut: (e: WheelEvent) => ViewBox.zoomInOut(e),
      reset: () => ViewBox.reset(),
      isEditPage,
      isGoogleMapEditMode,
      activeMapDisabledGoogleMap,
      save: () => SvgsStore.updateSvgs()
    }
  },
})
</script>

<style scoped lang="sass">
.svg-base-sheet
  height: 75vh
  touch-action: none
  background-color: transparent

.mysvg-edit
  background-image: linear-gradient(90deg, transparent 19px, #ddd 20px), linear-gradient(0deg, transparent 19px, #ddd 20px)
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
