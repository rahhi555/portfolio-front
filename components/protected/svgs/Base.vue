<template>
  <v-sheet
    ref="svgSheet"
    style="touch-action: none"
    color="gray"
    elevation="6"
    height="75vh"
  >
    <svg
      :class="[{ 'mysvg-edit': isEditPage }, svgCursorClass]"
      width="100%"
      height="100%"
      :viewBox="viewBoxStr"
      xmlns="http://www.w3.org/2000/svg"
      @pointermove="
        scrollMiddle($event)
        dragMiddle($event)
        resizeMiddle($event)
      "
      @pointerup="
        scrollEnd()
        dragStop()
        resizeStop()
      "
      @pointerdown.left="
        scrollBegin($event)
        addPath($event)
      "
      @wheel.prevent="zoomInOut"
    >
      <SvgsRect
        v-for="rect in rects" 
        :key="rect.id"
        :rect="rect"
        :is-edit-page="isEditPage"
      ></SvgsRect>

      <SvgsPath
        v-for="path in paths"
        :key="path.id"
        :path="path"
        :is-edit-page="isEditPage"
      ></SvgsPath>
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

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon class="zoom-chip" large v-bind="attrs" @click="reset" v-on="on"
          >mdi-magnify-remove-outline</v-icon
        >
      </template>
      <span>表示リセット</span>
    </v-tooltip>

    <SvgsContextMenu></SvgsContextMenu>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  useRoute,
} from '@nuxtjs/composition-api'
import { debounce } from 'mabiki'
import { SvgsStore } from '~/store'
import ViewBox from '~/utils/helpers/svg-viewbox'
import AddEventSpaceKey from '~/utils/helpers/add-event-space-press'
import Drag from '~/utils/helpers/svg-drag'
import Resize from '~/utils/helpers/svg-resize'
import Path from '~/utils/helpers/svg-add-path'

export default defineComponent({
  setup() {
    const rects = computed(() => SvgsStore.activeMapSvgs('Rect'))
    const paths = computed(() => SvgsStore.activeMapSvgs('Path'))

    ViewBox.mounted()
    AddEventSpaceKey.mounted()
    AddEventSpaceKey.unMounted()

    // スペースキーの押下判定
    const isSpaceKeyPress = AddEventSpaceKey.isSpaceKeyPress

    // 現在のページが編集ページかどうか
    const route = useRoute()
    const isEditPage = computed(() => route.value.name?.endsWith('edit'))

    // ピンの挿入モード判定
    const isAddPathMode = Path.isAddPathMode

    // ピン挿入
    const addPath = (e: PointerEvent) => {
      if(isSpaceKeyPress.value || !isAddPathMode.value) return
      if(isEditPage.value) {
        Path.addStaticPath(e)
      } else {
        Path.sendActivePath(e)
      }
    }

    // svgのカーソルのクラス
    const svgCursorClass = computed(() => {
      if(isSpaceKeyPress.value) {
        return 'move'
      } else if(isAddPathMode.value) {
        return 'add-path-mode'
      }
    })

    // viewBox操作
    const scrollBegin = (e: MouseEvent) => {
      if (!isSpaceKeyPress.value && isEditPage.value) return
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

      svgSheet: ViewBox.svgSheet,
      viewBoxStr: ViewBox.viewBoxStr(),

      addPath,

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
      isAddPathMode,
      isSpaceKeyPress,
      svgCursorClass
    }
  },
})
</script>

<style scoped lang="sass">
.mysvg-edit
  background-image: linear-gradient(90deg, transparent 19px, #333 20px), linear-gradient(0deg, transparent 19px, #333 20px)
  background-size: 20px 20px
  background-repeat: repeat
  background-color: #ddd

.pointer
  cursor: pointer

.move
  cursor: move

.zoom-chip
  position: absolute
  bottom: 80px
  right: 30px

.add-path-mode
  cursor: url('~assets/map-marker.svg') 25 25, pointer
</style>
