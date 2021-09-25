<template>
  <v-sheet
    ref="svgSheet"
    style="touch-action none;"
    color="gray"
    elevation="6"
    height="75vh"
  >
    <svg
      id="mysvg-edit"
      width="100%"
      height="100%"
      :viewBox="viewBoxStr"
      xmlns="http://www.w3.org/2000/svg"
      @pointermove="
        dragMiddle($event)
        resizeMiddle($event)
        scrollMiddle($event)
      "
      @pointerup="
        dragStop()
        resizeStop()
        scrollEnd()
      "
      @pointerdown.left="scrollBegin($event)"
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
            :fill="rect.fill"
            :stroke="rect.stroke"
            tabindex="0"
            class="grabbable"
            @pointerdown.left="dragStart($event)"
            @keydown="moveRectArrowKey($event)"
            @keydown.delete="deleteSvg($event)"
            @contextmenu.prevent="showMenu($event)"
          />
          <line
            x1="0"
            y1="0"
            :x2="rect.width"
            y2="0"
            class="top-line"
            @mousedown.stop="resizeStart($event)"
          />
          <line
            :x1="rect.width"
            y1="0"
            :x2="rect.width"
            :y2="rect.height"
            class="right-line"
            @mousedown.stop="resizeStart($event)"
          />
          <line
            x1="0"
            :y1="rect.height"
            :x2="rect.width"
            :y2="rect.height"
            class="bottom-line"
            @mousedown.stop="resizeStart($event)"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            :y2="rect.height"
            class="left-line"
            @mousedown.stop="resizeStart($event)"
          />
        </g>
      </template>
    </svg>

    <v-menu
      v-model="isShowMenu"
      :position-x="position.x"
      :position-y="position.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          class="pointer"
          @click="item.func()"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  nextTick,
  watch,
} from '@nuxtjs/composition-api'
import { SVGRectMouseEvent, SVGRectKeyboardEvent } from 'interface'
import { debounce } from 'mabiki'
import { SvgsStore } from '~/store'
import { SvgDrag } from '~/utils/helpers/svg-drag'
import { SvgResize } from '~/utils/helpers/svg-resize'
import { ViewBox } from '~/utils/helpers/svg-viewbox'
import { AddEventSpaceKey } from '~/utils/helpers/add-event-space-press'

export default defineComponent({
  setup() {
    const rects = computed(() => SvgsStore.activeMapRects)

    const svgDrag = new SvgDrag()
    const svgResize = new SvgResize()
    const viewBox = new ViewBox()
    const addEventSpaceKey = new AddEventSpaceKey()

    // マウスのドラッグ操作
    const dragStart = (e: SVGRectMouseEvent) => {
        isShowMenu.value = false
        svgDrag.dragStart(e)
      }
    const dragMiddle = (e: SVGRectMouseEvent) => svgDrag.dragMiddle(e)
    const dragStop = () => svgDrag.dragStop()

    // 方向キーのドラッグ操作
    const moveRectArrowKey = (e: SVGRectKeyboardEvent) => {
      isShowMenu.value = false
      svgDrag.moveRectArrowKey(e)
    }

    // リサイズ操作
    const resizeStart = (e: SVGRectMouseEvent) => {
        isShowMenu.value = false
        svgResize.resizeStart(e)
      }
    const resizeMiddle = (e: SVGRectMouseEvent) => svgResize.resizeMiddle(e)
    const resizeStop = () => svgResize.resizeStop()

    // --- svg削除 ---
    const deleteSvg = (e: SVGRectKeyboardEvent) => {
      SvgsStore.deleteSvg(e)
    }

    // --- コンテキストメニュー表示 ---
    const isShowMenu = ref(false)
    const position = reactive({ x: 0, y: 0 })
    const showMenu = (e: SVGRectMouseEvent) => {
      isShowMenu.value = false
      SvgsStore.setTargetId(e)
      position.x = e.clientX
      position.y = e.clientY
      nextTick(() => {
        isShowMenu.value = true
      })
    }
    const menuItems = [
      { title: '最上面に移動', func: () => SvgsStore.changeOrder('top') },
      { title: '一つ上に移動', func: () => SvgsStore.changeOrder('up') },
      { title: '一つ下に移動', func: () => SvgsStore.changeOrder('down') },
      { title: '最下面に移動', func: () => SvgsStore.changeOrder('bottom') },
    ]

    // オートセーブ
    const autosave = debounce(
      function () {
        SvgsStore.updateSvgs()
      },
      3000,
      { maxWait: 30000 }
    )
    watch(SvgsStore.allRects, () => autosave())

    // viewBox操作
    const scrollBegin = (e: MouseEvent) => {
      if(!addEventSpaceKey.isSpaceKeyPress) return
      viewBox.scrollBegin(e)
    }
    const scrollMiddle = (e: MouseEvent) => {
      if(!addEventSpaceKey.isSpaceKeyPress) return
      viewBox.scrollMiddle(e)
    }
    const scrollEnd = () => {
      viewBox.scrollEnd()
    }

    return {
      rects,
      dragStart,
      dragMiddle,
      dragStop,
      moveRectArrowKey,
      resizeStart,
      resizeMiddle,
      resizeStop,
      deleteSvg,
      showMenu,
      isShowMenu,
      position,
      menuItems,
      svgSheet: viewBox.svgSheet,
      viewBoxStr: viewBox.viewBoxStr,
      scrollBegin,
      scrollMiddle,
      scrollEnd
    }
  },
})
</script>

<style scope>
#mysvg-edit {
  background-image: linear-gradient(90deg, transparent 19px, #333 20px),
    linear-gradient(0deg, transparent 19px, #333 20px);
  background-size: 20px 20px;
  background-repeat: repeat;
  background-color: #ddd;
}

.grabbable {
  cursor: grab;
}
.grabbable:active {
  cursor: grabbing;
}

.top-line,
.bottom-line {
  cursor: row-resize;
  stroke-width: 15;
  stroke: transparent;
}
.right-line,
.left-line {
  cursor: col-resize;
  stroke-width: 15;
  stroke: transparent;
}
</style>
