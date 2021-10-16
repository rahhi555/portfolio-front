import { SvgsStore } from '~/store'

// 何倍単位で移動するかの定数
const MULTIPLE_NUMBER = 20
// ドラッグ中かどうかの判定
let isDragging = false
// クリックした瞬間の座標から対象rectのXY座標を引いた値。ドラッグする際に図形の左上に移動する現象を防ぐ
const gapXY = { x: 0, y: 0 }

export default {
  // --- ドラッグ処理 ---
  dragStart(e: PointerEvent): void {
    SvgsStore.setTargetId(e)
    if (typeof SvgsStore.targetSvg === 'undefined') {
      return
    }
    isDragging = true
    gapXY.x = e.offsetX - SvgsStore.targetSvg.x
    gapXY.y = e.offsetY - SvgsStore.targetSvg.y
  },

  dragMiddle(e: MouseEvent): void{
    if (isDragging) {
      const moveX = e.offsetX - gapXY.x
      const moveY = e.offsetY - gapXY.y
      const multipleMoveX =
        Math.floor(moveX / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
      const multipleMoveY =
        Math.floor(moveY / MULTIPLE_NUMBER) * MULTIPLE_NUMBER
      SvgsStore.changeSvg({ status: 'x', value: multipleMoveX })
      SvgsStore.changeSvg({ status: 'y', value: multipleMoveY })
    }
  },

  dragStop(): void {
    isDragging = false
    SvgsStore.setTargetId(0)
  },

  // 十字キーでドラッグするための処理
  moveRectArrowKey(e: KeyboardEvent): void {
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
  },
}
