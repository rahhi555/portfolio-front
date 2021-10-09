<template>
  <v-sheet
    ref="svgSheet"
    style="touch-action: none"
    color="gray"
    elevation="6"
    height="75vh"
    :class="{ move: isSpaceKeyPress }"
  >
    <svg
      :class="{ 'mysvg-edit': isEditPage }"
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
      @pointerdown.left="scrollBegin"
      @wheel.prevent="zoomInOut"
    >
      <svg-rect
        v-for="rect in rects"
        :key="rect.id"
        :rect="rect"
        :is-edit-page="isEditPage"
      ></svg-rect>
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

    <svg-context-menu></svg-context-menu>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useContext,
  watch,
  useRoute,
} from '@nuxtjs/composition-api'
import { SVGRectMouseEvent } from 'interface'
import { debounce } from 'mabiki'
import { SvgsStore } from '~/store'
import ViewBox from '~/utils/helpers/svg-viewbox'
import AddEventSpaceKey from '~/utils/helpers/add-event-space-press'
import Drag from '~/utils/helpers/svg-drag'
import Resize from '~/utils/helpers/svg-resize'
import SvgRect from '~/components/protected/svgs/SvgRect.vue'
import SvgContextMenu from '~/components/protected/svgs/SvgContextMenu.vue'

export default defineComponent({
  components: {
    SvgRect,
    SvgContextMenu,
  },

  setup() {
    const { $device } = useContext()

    const rects = computed(() => SvgsStore.activeMapRects)
    ViewBox.mounted()
    AddEventSpaceKey.mounted()
    AddEventSpaceKey.unMounted()

    // スペースキーの押下判定
    const isSpaceKeyPress = ref(AddEventSpaceKey.isSpaceKeyPress)

    // viewBox操作
    const scrollBegin = (e: MouseEvent) => {
      if (!isSpaceKeyPress.value && $device.isDesktop) return
      ViewBox.scrollBegin(e)
    }
    const scrollMiddle = (e: MouseEvent) => {
      if (!isSpaceKeyPress.value && $device.isDesktop) return
      ViewBox.scrollMiddle(e)
    }
    const scrollEnd = () => {
      ViewBox.scrollEnd()
    }

    // svgドラッグ
    const dragMiddle = (e: SVGRectMouseEvent) => {
      if (isSpaceKeyPress.value) return
      Drag.dragMiddle(e)
    }
    const dragStop = () => Drag.dragStop()

    // リサイズ操作
    const resizeMiddle = (e: SVGRectMouseEvent) => {
      if (isSpaceKeyPress.value) return
      Resize.resizeMiddle(e)
    }
    const resizeStop = () => Resize.resizeStop()

    // オートセーブ
    const autosave = debounce(
      function () {
        SvgsStore.updateSvgs()
      },
      3000,
      { maxWait: 30000 }
    )
    watch(SvgsStore.allRects, () => autosave())

    // 現在のページが編集ページかどうか
    const route = useRoute()
    const isEditPage = computed(() => route.value.name?.endsWith('edit'))

    return {
      rects,

      svgSheet: ViewBox.svgSheet,
      viewBoxStr: ViewBox.viewBoxStr(),

      scrollBegin,
      scrollMiddle,
      scrollEnd,

      dragMiddle,
      dragStop,

      resizeMiddle,
      resizeStop,

      zoomInOut: (e: WheelEvent) => ViewBox.zoomInOut(e),
      isSpaceKeyPress,
      reset: () => ViewBox.reset(),
      isEditPage,
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
</style>
