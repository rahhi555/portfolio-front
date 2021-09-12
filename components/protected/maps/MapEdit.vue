<template>
  <v-sheet color="gray" elevation="6" height="50vh">
    <svg
      id="mysvg-edit"
      x="0"
      y="0"
      width="100%"
      height="100%"
      viewBow="0 0 100% 100%"
      xmlns="http://www.w3.org/2000/svg"
      @mousemove="
        dragMiddle($event)
        resizeMiddle($event)
      "
      @mouseup="
        dragStop()
        resizeStop()
      "
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
            @mousedown="dragStart($event)"
            @keydown="moveRectArrowKey($event)"
            @keydown.delete="deleteSvg($event)"
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
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
} from '@nuxtjs/composition-api'
import { SVGRectMouseEvent, SVGRectKeyboardEvent } from 'interface'
import { SvgsStore } from '~/store'

export default defineComponent({
  setup() {
    const rects = computed(() => SvgsStore.activeMapRects)

    // 何倍単位で移動するかの定数
    const MULTIPLE_NUMBER: number = 20

    // --- ドラッグ処理 ---

    // ドラッグ中ならtrueになる
    const isDragging = ref<boolean>(false)
    // クリックした瞬間の座標から対象rectのXY座標を引いた値。ドラッグする際に図形の左上に移動する現象を防ぐ
    const gapXY = reactive<{ x: number; y: number }>({ x: 0, y: 0 })

    const dragStart = (e: SVGRectMouseEvent): void => {
      SvgsStore.setTargetId(e)
      if (typeof SvgsStore.targetSvg === 'undefined') {
        return
      }
      SvgsStore.changeOrder('up')
      isDragging.value = true
      gapXY.x = e.offsetX - SvgsStore.targetSvg.x
      gapXY.y = e.offsetY - SvgsStore.targetSvg.y
    }

    const dragMiddle = (e: MouseEvent): void => {
      // isDragging.valueがtrueならtargetSvgに中身があることは確定なので!を使用する
      if (isDragging.value) {
        const moveX = e.offsetX - gapXY.x
        const moveY = e.offsetY - gapXY.y
        const multipleMoveX =
          Math.floor(moveX / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
        const multipleMoveY =
          Math.floor(moveY / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
        SvgsStore.changeSvg({ status: 'x', value: multipleMoveX })
        SvgsStore.changeSvg({ status: 'y', value: multipleMoveY })
      }
    }

    const dragStop = (): void => {
      isDragging.value = false
      SvgsStore.setTargetId(0)
    }

    // 十字キーでドラッグするための処理
    const moveRectArrowKey = (e: SVGRectKeyboardEvent): void => {
      SvgsStore.setTargetId(e)
      if (typeof SvgsStore.targetSvg === 'undefined') {
        return
      }
      switch (e.key) {
        case 'ArrowUp':
          SvgsStore.changeSvg({
            status: 'y',
            value: SvgsStore.targetSvg.y - MULTIPLE_NUMBER,
          })
          break
        case 'ArrowDown':
          SvgsStore.changeSvg({
            status: 'y',
            value: SvgsStore.targetSvg.y + MULTIPLE_NUMBER,
          })
          break
        case 'ArrowRight':
          SvgsStore.changeSvg({
            status: 'x',
            value: SvgsStore.targetSvg.x + MULTIPLE_NUMBER,
          })
          break
        case 'ArrowLeft':
          SvgsStore.changeSvg({
            status: 'x',
            value: SvgsStore.targetSvg.x - MULTIPLE_NUMBER,
          })
          break
      }
      SvgsStore.setTargetId(0)
    }
    // --- ドラッグ処理終わり ---

    // --- リサイズ処理 ---

    // リサイズ中ならtrueになる
    const isResizing = ref<boolean>(false)
    // リサイズする方向を格納する
    let direction: string = ''
    // 上に引っ張る用の変数
    let startY: number = 0
    let startHeight: number = 0
    // 左に引っ張る用の変数
    let startX: number = 0
    let startWidth: number = 0

    const resizeStart = (e: SVGRectMouseEvent): void => {
      SvgsStore.setTargetId(e)
      if (typeof SvgsStore.targetSvg === 'undefined') {
        return
      }
      isResizing.value = true
      direction = e.target.classList[0]
      switch (direction) {
        case 'top-line':
          startY = SvgsStore.targetSvg.y
          startHeight = SvgsStore.targetSvg.height
          break
        case 'left-line':
          startX = SvgsStore.targetSvg.x
          startWidth = SvgsStore.targetSvg.width
          break
      }
    }

    const resizeMiddle = (e: SVGRectMouseEvent) => {
      // isResizing.valueがtrueならtargetRectに中身があることは確定なので、以降は!を使用する
      if (isResizing.value) {
        switch (direction) {
          case 'top-line':
            resizeMiddleTop(e)
            break
          case 'right-line':
            resizeMiddleRight(e)
            break
          case 'bottom-line':
            resizeMiddleBottom(e)
            break
          case 'left-line':
            resizeMiddleLeft(e)
            break
        }
      }
    }

    // 変化する値は式に一つまでにしないと急勾配な変化具合になってしまう
    // 上への引っ張りはheightを増加させると同時にyを減少させる
    const resizeMiddleTop = (e: SVGRectMouseEvent) => {
      const resizeHeight = startHeight + startY - e.offsetY
      if (resizeHeight > 0) {
        SvgsStore.changeSvg({
          status: 'height',
          value: Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
        })
        SvgsStore.changeSvg({
          status: 'y',
          value: Math.floor(e.offsetY / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
        })
      }
    }

    const resizeMiddleRight = (e: SVGRectMouseEvent) => {
      const resizeWidth = e.offsetX - SvgsStore.targetSvg!.x
      if (resizeWidth > 0) {
        SvgsStore.changeSvg({
          status: 'width',
          value: Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
        })
      }
    }

    const resizeMiddleBottom = (e: SVGRectMouseEvent) => {
      const resizeHeight = e.offsetY - SvgsStore.targetSvg!.y
      if (resizeHeight > 0) {
        SvgsStore.changeSvg({
          status: 'height',
          value: Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
        })
      }
    }

    // 左への引っ張りはwidthを増加させると同時にxを減少させる
    const resizeMiddleLeft = (e: SVGRectMouseEvent) => {
      // 現在のxよりクリックしているx座標が低くなればwidthが増える
      const resizeWidth = startWidth + startX - e.offsetX
      if (resizeWidth > 0) {
        // widthは増えるので切り上げ、xは減るので切り捨てする
        SvgsStore.changeSvg({
          status: 'width',
          value: Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
        })
        SvgsStore.changeSvg({
          status: 'x',
          value: Math.floor(e.offsetX / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
        })
      }
    }

    const resizeStop = () => {
      isResizing.value = false
      SvgsStore.setTargetId(0)
    }
    // --- リサイズ処理終わり ---

    // --- svg削除 ---
    const deleteSvg = (e: SVGRectKeyboardEvent) => {
      SvgsStore.deleteSvg(e)
    }
    // --- svg削除終わり ---

    return {
      rects,
      dragStart,
      dragMiddle,
      dragStop,
      resizeStart,
      resizeMiddle,
      resizeStop,
      moveRectArrowKey,
      deleteSvg,
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
