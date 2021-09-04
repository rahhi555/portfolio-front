<template>
  <v-sheet color="gray" elevation="6" height="50vh">
    <svg
      id="mysvg"
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
    <!-- <v-btn block class="primary" @click="addRect">add</v-btn> -->
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
} from '@nuxtjs/composition-api'
import { Rect, SVGRectMouseEvent, SVGRectKeyboardEvent } from 'interface'

export default defineComponent({
  setup() {
    // 四角形のオブジェクトをまとめる配列
    const rects = ref<Rect[]>([])
    // 移動中のrectのidを固定する変数。これがないと素早くマウスを動かした時にイベントターゲットが存在せずエラーになる。
    const targetingId = ref<number>(0)
    // 何倍単位で移動するかの定数
    const MULTIPLE_NUMBER: number = 20

    // $eventからidを取得し、targetingIdに代入する
    const setTargetingId = (e: SVGRectMouseEvent | SVGRectKeyboardEvent) => {
      const parentSVG = e.target.parentNode
      if (!(parentSVG instanceof SVGGElement)) {
        return
      }
      targetingId.value = Number(parentSVG?.id.replace('rect-', ''))
    }
    // targetingIdを元にクリックした図形を返す
    const targetRect = computed((): Rect | undefined => {
      return rects.value.find((rect) => {
        return rect.id === targetingId.value
      })
    })

    // --- ドラッグ処理 ---

    // ドラッグ中ならtrueになる
    const isDragging = ref<boolean>(false)
    // クリックした瞬間の座標から対象rectのXY座標を引いた値。ドラッグする際に図形の左上に移動する現象を防ぐ
    const gapXY = reactive<{ x: number; y: number }>({ x: 0, y: 0 })

    const dragStart = (e: SVGRectMouseEvent): void => {
      setTargetingId(e)
      if (typeof targetRect.value === 'undefined') {
        return
      }
      isDragging.value = true
      gapXY.x = e.offsetX - targetRect.value.x
      gapXY.y = e.offsetY - targetRect.value.y
    }

    const dragMiddle = (e: MouseEvent): void => {
      // isDragging.valueがtrueならtargetRectに中身があることは確定なので!を使用する
      if (isDragging.value) {
        const moveX = e.offsetX - gapXY.x
        const moveY = e.offsetY - gapXY.y
        const multipleMoveX =
          Math.floor(moveX / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
        const multipleMoveY =
          Math.floor(moveY / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
        targetRect.value!.x = multipleMoveX
        targetRect.value!.y = multipleMoveY
      }
    }

    const dragStop = (): void => {
      isDragging.value = false
      targetingId.value = 0
    }

    // 十字キーでドラッグするための処理
    const moveRectArrowKey = (e: SVGRectKeyboardEvent): void => {
      setTargetingId(e)
      if (typeof targetRect.value === 'undefined') {
        return
      }
      switch (e.key) {
        case 'ArrowUp':
          targetRect.value.y -= MULTIPLE_NUMBER
          break
        case 'ArrowDown':
          targetRect.value.y += MULTIPLE_NUMBER
          break
        case 'ArrowRight':
          targetRect.value.x += MULTIPLE_NUMBER
          break
        case 'ArrowLeft':
          targetRect.value.x -= MULTIPLE_NUMBER
          break
      }
      targetingId.value = 0
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
      setTargetingId(e)
      if (typeof targetRect.value === 'undefined') {
        return
      }
      isResizing.value = true
      direction = e.target.classList[0]
      switch (direction) {
        case 'top-line':
          startY = targetRect.value.y
          startHeight = targetRect.value.height
          break
        case 'left-line':
          startX = targetRect.value.x
          startWidth = targetRect.value.width
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
        targetRect.value!.height =
          Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
        targetRect.value!.y =
          Math.floor(e.offsetY / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
      }
    }

    const resizeMiddleRight = (e: SVGRectMouseEvent) => {
      const resizeWidth = e.offsetX - targetRect.value!.x
      if (resizeWidth > 0) {
        targetRect.value!.width =
          Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
      }
    }

    const resizeMiddleBottom = (e: SVGRectMouseEvent) => {
      const resizeHeight = e.offsetY - targetRect.value!.y
      if (resizeHeight > 0) {
        targetRect.value!.height =
          Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
      }
    }

    // 左への引っ張りはwidthを増加させると同時にxを減少させる
    const resizeMiddleLeft = (e: SVGRectMouseEvent) => {
      // 現在のxよりクリックしているx座標が低くなればwidthが増える
      const resizeWidth = startWidth + startX - e.offsetX
      if (resizeWidth > 0) {
        // widthは増えるので切り上げ、xは減るので切り捨てする
        targetRect.value!.width =
          Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
        targetRect.value!.x =
          Math.floor(e.offsetX / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
      }
    }

    const resizeStop = () => {
      isResizing.value = false
      targetingId.value = 0
    }
    // --- リサイズ処理終わり ---

    // 図形を追加する際の新しいidを返す
    const nextId = computed<number>(() => {
      const ids = rects.value.map((rect) => {
        return rect.id
      })
      const nextId = Math.max(...ids) + 1
      return nextId === -Infinity ? 1 : nextId
    })
    const addRect = (): void => {
      const newRect: Rect = {
        id: nextId.value,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: '#fff',
        stroke: 'black',
      }
      rects.value.push(newRect)
    }

    return {
      rects,
      dragStart,
      dragMiddle,
      dragStop,
      resizeStart,
      resizeMiddle,
      resizeStop,
      addRect,
      moveRectArrowKey,
    }
  },
})
</script>

<style scope>
#mysvg {
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
