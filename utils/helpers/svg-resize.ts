import { SVGRectMouseEvent } from 'interface'
import { SvgsStore } from '~/store'

export class SvgResize {
  // リサイズ中ならtrueになる
  private isResizing: boolean
  // リサイズする方向を格納する
  private direction: string
  // 上に引っ張る用の変数
  private startY: number
  private startHeight: number
  // 左に引っ張る用の変数
  private startX: number
  private startWidth: number
  private MULTIPLE_NUMBER: number

  constructor() {
    this.isResizing = false
    this.direction = ''
    this.startY = 0
    this.startHeight = 0
    this.startX = 0
    this.startWidth = 0
    this.MULTIPLE_NUMBER = 20
  }

  // --- リサイズ処理 ---

  public resizeStart = (e: SVGRectMouseEvent): void => {
    SvgsStore.setTargetId(e)
    if (typeof SvgsStore.targetSvg === 'undefined') {
      return
    }
    this.isResizing = true
    this.direction = e.target.classList[0]
    switch (this.direction) {
      case 'top-line':
        this.startY = SvgsStore.targetSvg.y
        this.startHeight = SvgsStore.targetSvg.height
        break
      case 'left-line':
        this.startX = SvgsStore.targetSvg.x
        this.startWidth = SvgsStore.targetSvg.width
        break
    }
  }

  public resizeMiddle = (e: SVGRectMouseEvent) => {
    if (this.isResizing) {
      switch (this.direction) {
        case 'top-line':
          this.resizeMiddleTop(e)
          break
        case 'right-line':
          this.resizeMiddleRight(e)
          break
        case 'bottom-line':
          this.resizeMiddleBottom(e)
          break
        case 'left-line':
          this.resizeMiddleLeft(e)
          break
      }
    }
  }

  // 変化する値は式に一つまでにしないと急勾配な変化具合になってしまう
  // 上への引っ張りはheightを増加させると同時にyを減少させる
  private resizeMiddleTop = (e: SVGRectMouseEvent) => {
    const resizeHeight = this.startHeight + this.startY - e.offsetY
    if (resizeHeight > 0) {
      SvgsStore.changeSvg({
        status: 'height',
        value: Math.ceil(resizeHeight / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER,
      })
      SvgsStore.changeSvg({
        status: 'y',
        value: Math.floor(e.offsetY / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER,
      })
    }
  }

  private resizeMiddleRight = (e: SVGRectMouseEvent) => {
    const resizeWidth = e.offsetX - SvgsStore.targetSvg!.x
    if (resizeWidth > 0) {
      SvgsStore.changeSvg({
        status: 'width',
        value: Math.ceil(resizeWidth / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER,
      })
    }
  }

  private resizeMiddleBottom = (e: SVGRectMouseEvent) => {
    const resizeHeight = e.offsetY - SvgsStore.targetSvg!.y
    if (resizeHeight > 0) {
      SvgsStore.changeSvg({
        status: 'height',
        value: Math.ceil(resizeHeight / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER,
      })
    }
  }

  // // 左への引っ張りはwidthを増加させると同時にxを減少させる
  private resizeMiddleLeft = (e: SVGRectMouseEvent) => {
    // 現在のxよりクリックしているx座標が低くなればwidthが増える
    const resizeWidth = this.startWidth + this.startX - e.offsetX
    if (resizeWidth > 0) {
      // widthは増えるので切り上げ、xは減るので切り捨てする
      SvgsStore.changeSvg({
        status: 'width',
        value: Math.ceil(resizeWidth / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER,
      })
      SvgsStore.changeSvg({
        status: 'x',
        value: Math.floor(e.offsetX / this.MULTIPLE_NUMBER) * this.MULTIPLE_NUMBER,
      })
    }
  }

  public resizeStop = () => {
    this.isResizing = false
    SvgsStore.setTargetId(0)
  }

}
