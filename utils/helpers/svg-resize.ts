import { SVGRectMouseEvent } from 'interface'
import { SvgsStore } from '~/store'

// リサイズ中ならtrueになる
let isResizing = false
// リサイズする方向を格納する
let direction = ''
// 上に引っ張る用の変数
let startY = 0
let startHeight = 0
// 左に引っ張る用の変数
let startX = 0
let startWidth = 0
const MULTIPLE_NUMBER = 20

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

// // 左への引っ張りはwidthを増加させると同時にxを減少させる
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

// --- リサイズ処理 ---
export default {
  resizeStart(e: SVGRectMouseEvent): void {
    SvgsStore.setTargetId(e)
    if (typeof SvgsStore.targetSvg === 'undefined') {
      return
    }
    isResizing = true
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
  },

  resizeMiddle(e: SVGRectMouseEvent) {
    if (isResizing) {
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
  },

  resizeStop() {
    isResizing = false
    SvgsStore.setTargetId(0)
  },
}
