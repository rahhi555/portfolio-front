import { SVGRectMouseEvent, SVGRectKeyboardEvent } from 'interface'
import { SvgsStore } from '~/store'

export class SvgDrag {
  // 何倍単位で移動するかの定数
  private MULTIPLE_NUMBER: number
  // ドラッグ中かどうかの判定
  private isDragging: boolean
  // クリックした瞬間の座標から対象rectのXY座標を引いた値。ドラッグする際に図形の左上に移動する現象を防ぐ
  private gapXY: { x: number; y: number }

  constructor() {
    this.MULTIPLE_NUMBER = 20
    this.isDragging = false
    this.gapXY = { x: 0, y: 0 }
  }

  // --- ドラッグ処理 ---

  public dragStart = (e: SVGRectMouseEvent): void => {
    SvgsStore.setTargetId(e)
    if (typeof SvgsStore.targetSvg === 'undefined') {
      return
    }
    this.isDragging = true
    this.gapXY.x = e.offsetX - SvgsStore.targetSvg.x
    this.gapXY.y = e.offsetY - SvgsStore.targetSvg.y
  }

  public dragMiddle = (e: MouseEvent): void => {
    if (this.isDragging) {
      const moveX = e.offsetX - this.gapXY.x
      const moveY = e.offsetY - this.gapXY.y
      const multipleMoveX =
        Math.floor(moveX / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER
      const multipleMoveY =
        Math.floor(moveY / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER
      SvgsStore.changeSvg({ status: 'x', value: multipleMoveX })
      SvgsStore.changeSvg({ status: 'y', value: multipleMoveY })
    }
  }

  public dragStop = (): void => {
    this.isDragging = false
    SvgsStore.setTargetId(0)
  }

  // 十字キーでドラッグするための処理
  public moveRectArrowKey = (e: SVGRectKeyboardEvent): void => {
    SvgsStore.setTargetId(e)
    if (typeof SvgsStore.targetSvg === 'undefined') {
      return
    }
    switch (e.key) {
      case 'ArrowUp':
        SvgsStore.changeSvg({
          status: 'y',
          value: SvgsStore.targetSvg.y - this.MULTIPLE_NUMBER,
        })
        break
      case 'ArrowDown':
        SvgsStore.changeSvg({
          status: 'y',
          value: SvgsStore.targetSvg.y + this.MULTIPLE_NUMBER,
        })
        break
      case 'ArrowRight':
        SvgsStore.changeSvg({
          status: 'x',
          value: SvgsStore.targetSvg.x + this.MULTIPLE_NUMBER,
        })
        break
      case 'ArrowLeft':
        SvgsStore.changeSvg({
          status: 'x',
          value: SvgsStore.targetSvg.x - this.MULTIPLE_NUMBER,
        })
        break
    }
    SvgsStore.setTargetId(0)
  }
}
