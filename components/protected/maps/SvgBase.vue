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
      id="mysvg-edit"
      width="100%"
      height="100%"
      :viewBox="viewBoxStr"
      xmlns="http://www.w3.org/2000/svg"
      @pointermove="
        scrollMiddle($event)
        pointerMoveHandle($event)
      "
      @pointerup="
        scrollEnd()
        pointerUpHandle($event)
      "
      @pointerdown.left="scrollBegin($event)"
      @wheel.prevent="zoomInOut($event)"
    >
      <template v-for="rect in rects">
        <g
          :id="'rect-' + rect.id"
          :key="rect.id"
          :transform="'translate(' + rect.x + ',' + rect.y + ')'"
        >
          <rect
            :width="rect.width"
            :height="rect.height"
            :fill="fill(rect)"
            :stroke="rect.stroke"
            tabindex="0"
            :class="rectClass"
            @pointerdown.left="pointerDownHandle"
            @keydown="keyDownHandle"
            @keydown.delete="deleteHandle"
            @contextmenu.prevent="contextMenuHandle"
            @dragenter="dragEnterHandle"
            @dragleave="dragLeaveHandle"
          />
          <line
            x1="0"
            y1="0"
            :x2="rect.width"
            y2="0"
            :class="{ 'top-line': isResizeActive }"
            @pointerdown.stop="linePointerDownHandle"
          />
          <line
            :x1="rect.width"
            y1="0"
            :x2="rect.width"
            :y2="rect.height"
            :class="{ 'right-line': isResizeActive }"
            @pointerdown.stop="linePointerDownHandle"
          />
          <line
            x1="0"
            :y1="rect.height"
            :x2="rect.width"
            :y2="rect.height"
            :class="{ 'bottom-line': isResizeActive }"
            @pointerdown.stop="linePointerDownHandle"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            :y2="rect.height"
            :class="{ 'left-line': isResizeActive }"
            @pointerdown.stop="linePointerDownHandle"
          />
          <svg-text :rect="rect"></svg-text>
        </g>
      </template>
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
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useContext,
} from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { SvgsStore, TodoListsStore } from '~/store'
import ViewBox from '~/utils/helpers/svg-viewbox'
import AddEventSpaceKey from '~/utils/helpers/add-event-space-press'
import SvgText from '~/components/protected/maps/SvgText.vue'

export default defineComponent({
  components: {
    SvgText,
  },

  props: {
    rectClass: {
      type: String,
      default: 'grabbable',
    },
    isResizeActive: {
      type: Boolean,
      default: true,
    },
  },

  setup(_, { emit }) {
    const { $device } = useContext()

    const rects = computed(() => SvgsStore.activeMapRects)
    ViewBox.mounted()
    AddEventSpaceKey.mounted()
    AddEventSpaceKey.unMounted()

    // スペースキーの押下判定
    const isSpaceKeyPress = ref(AddEventSpaceKey.isSpaceKeyPress)

    // viewBox操作
    const scrollBegin = (e: MouseEvent) => {
      if (!isSpaceKeyPress.value && $device.isDesktop ) return
      ViewBox.scrollBegin(e)
    }
    const scrollMiddle = (e: MouseEvent) => {
      if (!isSpaceKeyPress.value && $device.isDesktop ) return
      ViewBox.scrollMiddle(e)
    }
    const scrollEnd = () => {
      ViewBox.scrollEnd()
    }

    // 各種イベントのemit
    const pointerMoveHandle = (e: PointerEvent) => {
      emit('pointerMoveHandle', e)
    }
    const pointerUpHandle = (e: PointerEvent) => {
      emit('pointerUpHandle', e)
    }
    const pointerDownHandle = (e: PointerEvent) => {
      emit('pointerDownHandle', e)
    }
    const keyDownHandle = (e: PointerEvent) => {
      emit('keyDownHandle', e)
    }
    const deleteHandle = (e: PointerEvent) => {
      emit('deleteHandle', e)
    }
    const contextMenuHandle = (e: PointerEvent) => {
      emit('contextMenuHandle', e)
    }
    const dragEnterHandle = (e: PointerEvent) => {
      emit('dragEnterHandle', e)
    }
    const dragLeaveHandle = (e: PointerEvent) => {
      emit('dragLeaveHandle', e)
    }
    const linePointerDownHandle = (e: PointerEvent) => {
      emit('linePointerDownHandle', e)
    }

    const fill = (rect: Rect) => {
      const NO_ATTACH_COLOR = 'white'
      const TODO_COLOR = '#cccccc'
      const DOING_COLOR = '#E6EE9C'
      const DONE_COLOR = '#66BB6A'

      const { todoListId } = rect
      if (!todoListId) return NO_ATTACH_COLOR

      const todos = TodoListsStore.todoList.find(todoList => todoList.id === todoListId)?.todos
      if (!todos || !todos.length) return NO_ATTACH_COLOR
      if (todos.every((todo) => todo.status === 'todo')) {
        return TODO_COLOR
      } else if (todos.every((todo) => todo.status === 'done')) {
        return DONE_COLOR
      } else {
        return DOING_COLOR
      }
    }

    return {
      rects,

      pointerMoveHandle,
      pointerUpHandle,
      pointerDownHandle,
      keyDownHandle,
      deleteHandle,
      contextMenuHandle,
      dragEnterHandle,
      dragLeaveHandle,
      linePointerDownHandle,

      svgSheet: ViewBox.svgSheet,
      viewBoxStr: ViewBox.viewBoxStr(),
      scrollBegin,
      scrollMiddle,
      scrollEnd,
      zoomInOut: (e: WheelEvent) => ViewBox.zoomInOut(e),
      isSpaceKeyPress,

      fill
    }
  },
})
</script>

<style scoped lang="sass">
#mysvg-edit
  background-image: linear-gradient(90deg, transparent 19px, #333 20px), linear-gradient(0deg, transparent 19px, #333 20px)
  background-size: 20px 20px
  background-repeat: repeat
  background-color: #ddd

.pointer
  cursor: pointer

.grabbable
  cursor: grab
.grabbable:active
  cursor: grabbing

.move
  cursor: move

// top-line,bottom-line,right-line,left-lineはリサイズ処理でそのクラス名を使用するので変更しないこと
.top-line, .bottom-line
  cursor: row-resize
  stroke-width: 15
  stroke: transparent
.right-line, .left-line
  cursor: col-resize
  stroke-width: 15
  stroke: transparent

.zoom-chip
  position: absolute
  bottom: 80px
  right: 10px
</style>
