import { SvgsStore } from '~/store'
import { zoomParcentHeight, zoomParcentWidth, minY, minX } from '~/utils/svgs/svg-viewbox'
import { isSomeTrueModes } from '~/utils/ui/svg-cursor'
import { isEditPage } from '~/utils/ui/common'
import { isShowMenu } from '~/utils/ui/svg-context-menu'

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
const resizeMiddleTop = (e: PointerEvent) => {
  // zoom倍率で割った非zoomの値+スクロール分の値
  const mouseEventY = e.offsetY / zoomParcentHeight() + minY.value
  const resizeHeight = startHeight + startY - mouseEventY
  if (resizeHeight > 0) {
    SvgsStore.changeSvg({
      status: 'height',
      value: Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
    })
    SvgsStore.changeSvg({
      status: 'y',
      value: Math.floor(mouseEventY / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
    })
  }
}

const resizeMiddleRight = (e: PointerEvent) => {
  // zoom倍率で割った非zoomの値
  const mouseEventX = e.offsetX / zoomParcentWidth()
  // マウス位置 - 図形の左端 + スクロール分
  const resizeWidth = mouseEventX - SvgsStore.targetSvg!.x + minX.value
  if (resizeWidth > 0) {
    SvgsStore.changeSvg({
      status: 'width',
      value: Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
    })
  }
}

const resizeMiddleBottom = (e: PointerEvent) => {
  const mouseEventY = e.offsetY / zoomParcentHeight()
  const resizeHeight = mouseEventY - SvgsStore.targetSvg!.y + minY.value
  if (resizeHeight > 0) {
    SvgsStore.changeSvg({
      status: 'height',
      value: Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
    })
  }
}

// // 左への引っ張りはwidthを増加させると同時にxを減少させる
const resizeMiddleLeft = (e: PointerEvent) => {
  // mouseEventXはマウスカーソル位置とviewboxの位置を足したもの
  const mouseEventX = e.offsetX / zoomParcentWidth() + minX.value
  // 現在のxよりクリックしているx座標が低くなればwidthが増える
  const resizeWidth = startWidth + startX - mouseEventX
  if (resizeWidth > 0) {
    // widthは増えるので切り上げ、xは減るので切り捨てする
    SvgsStore.changeSvg({
      status: 'width',
      value: Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
    })
    SvgsStore.changeSvg({
      status: 'x',
      value: Math.floor(mouseEventX / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
    })
  }
}

// --- リサイズ処理 ---
export const resizeStart = (e: PointerEvent): void => {
  if (!isEditPage.value || isSomeTrueModes.value) return

  SvgsStore.setTargetId(e)
  if (typeof SvgsStore.targetSvg === 'undefined') return

  isShowMenu.value = false
  isResizing = true
  const target = e.target as SVGGElement
  direction = target.classList[0]
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

export const resizeMiddle = (e: PointerEvent) => {
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
}

export const resizeStop = () => {
  isResizing = false
  SvgsStore.setTargetId(0)
}
