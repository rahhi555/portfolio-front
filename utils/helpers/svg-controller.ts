import { computed, ref, Ref } from '@nuxtjs/composition-api'
import { SVGRectMouseEvent } from 'interface'
import { SvgsStore } from '~/store'

export class SvgController {
  // 何倍単位で移動するかの定数
  private MULTIPLE_NUMBER: number
  // ドラッグ中かどうかの判定
  private isDragging: Ref<boolean>
  // クリックした瞬間の座標から対象rectのXY座標を引いた値。ドラッグする際に図形の左上に移動する現象を防ぐ
  private gapXY: { x: number; y: number }

  constructor() {
    this.MULTIPLE_NUMBER = 20
    this.isDragging = ref(false)
    this.gapXY = { x: 0, y: 0 }
  }

  public rects = computed(() => SvgsStore.activeMapRects)

  // --- ドラッグ処理 ---

  public dragStart = (e: SVGRectMouseEvent): void => {
    SvgsStore.setTargetId(e)
    if (typeof SvgsStore.targetSvg === 'undefined') {
      return
    }
    this.isDragging.value = true
    this.gapXY.x = e.offsetX - SvgsStore.targetSvg.x
    this.gapXY.y = e.offsetY - SvgsStore.targetSvg.y
  }

  public dragMiddle = (e: MouseEvent): void => {
    if (this.isDragging.value) {
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
    this.isDragging.value = false
    SvgsStore.setTargetId(0)
  }

  // 十字キーでドラッグするための処理
  // const moveRectArrowKey = (e: SVGRectKeyboardEvent): void => {
  //   isShowMenu.value = false
  //   SvgsStore.setTargetId(e)
  //   if (typeof SvgsStore.targetSvg === 'undefined') {
  //     return
  //   }
  //   switch (e.key) {
  //     case 'ArrowUp':
  //       SvgsStore.changeSvg({
  //         status: 'y',
  //         value: SvgsStore.targetSvg.y - MULTIPLE_NUMBER,
  //       })
  //       break
  //     case 'ArrowDown':
  //       SvgsStore.changeSvg({
  //         status: 'y',
  //         value: SvgsStore.targetSvg.y + MULTIPLE_NUMBER,
  //       })
  //       break
  //     case 'ArrowRight':
  //       SvgsStore.changeSvg({
  //         status: 'x',
  //         value: SvgsStore.targetSvg.x + MULTIPLE_NUMBER,
  //       })
  //       break
  //     case 'ArrowLeft':
  //       SvgsStore.changeSvg({
  //         status: 'x',
  //         value: SvgsStore.targetSvg.x - MULTIPLE_NUMBER,
  //       })
  //       break
  //   }
  //   SvgsStore.setTargetId(0)
  // }

  // // --- リサイズ処理 ---

  // // リサイズ中ならtrueになる
  // const isResizing = ref<boolean>(false)
  // // リサイズする方向を格納する
  // let direction: string = ''
  // // 上に引っ張る用の変数
  // let startY: number = 0
  // let startHeight: number = 0
  // // 左に引っ張る用の変数
  // let startX: number = 0
  // let startWidth: number = 0

  // const resizeStart = (e: SVGRectMouseEvent): void => {
  //   SvgsStore.setTargetId(e)
  //   if (typeof SvgsStore.targetSvg === 'undefined') {
  //     return
  //   }
  //   isResizing.value = true
  //   direction = e.target.classList[0]
  //   switch (direction) {
  //     case 'top-line':
  //       startY = SvgsStore.targetSvg.y
  //       startHeight = SvgsStore.targetSvg.height
  //       break
  //     case 'left-line':
  //       startX = SvgsStore.targetSvg.x
  //       startWidth = SvgsStore.targetSvg.width
  //       break
  //   }
  // }

  // const resizeMiddle = (e: SVGRectMouseEvent) => {
  //   // isResizing.valueがtrueならtargetRectに中身があることは確定なので、以降は!を使用する
  //   if (isResizing.value) {
  //     switch (direction) {
  //       case 'top-line':
  //         resizeMiddleTop(e)
  //         break
  //       case 'right-line':
  //         resizeMiddleRight(e)
  //         break
  //       case 'bottom-line':
  //         resizeMiddleBottom(e)
  //         break
  //       case 'left-line':
  //         resizeMiddleLeft(e)
  //         break
  //     }
  //   }
  // }

  // // 変化する値は式に一つまでにしないと急勾配な変化具合になってしまう
  // // 上への引っ張りはheightを増加させると同時にyを減少させる
  // const resizeMiddleTop = (e: SVGRectMouseEvent) => {
  //   const resizeHeight = startHeight + startY - e.offsetY
  //   if (resizeHeight > 0) {
  //     SvgsStore.changeSvg({
  //       status: 'height',
  //       value: Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
  //     })
  //     SvgsStore.changeSvg({
  //       status: 'y',
  //       value: Math.floor(e.offsetY / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
  //     })
  //   }
  // }

  // const resizeMiddleRight = (e: SVGRectMouseEvent) => {
  //   const resizeWidth = e.offsetX - SvgsStore.targetSvg!.x
  //   if (resizeWidth > 0) {
  //     SvgsStore.changeSvg({
  //       status: 'width',
  //       value: Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
  //     })
  //   }
  // }

  // const resizeMiddleBottom = (e: SVGRectMouseEvent) => {
  //   const resizeHeight = e.offsetY - SvgsStore.targetSvg!.y
  //   if (resizeHeight > 0) {
  //     SvgsStore.changeSvg({
  //       status: 'height',
  //       value: Math.ceil(resizeHeight / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
  //     })
  //   }
  // }

  // // 左への引っ張りはwidthを増加させると同時にxを減少させる
  // const resizeMiddleLeft = (e: SVGRectMouseEvent) => {
  //   // 現在のxよりクリックしているx座標が低くなればwidthが増える
  //   const resizeWidth = startWidth + startX - e.offsetX
  //   if (resizeWidth > 0) {
  //     // widthは増えるので切り上げ、xは減るので切り捨てする
  //     SvgsStore.changeSvg({
  //       status: 'width',
  //       value: Math.ceil(resizeWidth / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
  //     })
  //     SvgsStore.changeSvg({
  //       status: 'x',
  //       value: Math.floor(e.offsetX / MULTIPLE_NUMBER) * MULTIPLE_NUMBER,
  //     })
  //   }
  // }

  // const resizeStop = () => {
  //   isResizing.value = false
  //   SvgsStore.setTargetId(0)
  // }

  // // --- svg削除 ---
  // const deleteSvg = (e: SVGRectKeyboardEvent) => {
  //   SvgsStore.deleteSvg(e)
  // }

  // // --- コンテキストメニュー表示 ---
  // const isShowMenu = ref(false)
  // const position = reactive({ x: 0, y: 0 })
  // const showMenu = (e: SVGRectMouseEvent) => {
  //   isShowMenu.value = false
  //   SvgsStore.setTargetId(e)
  //   position.x = e.clientX
  //   position.y = e.clientY
  //   nextTick(() => {
  //     isShowMenu.value = true
  //   })
  // }
  // const menuItems = [
  //   { title: '最上面に移動', func: () => SvgsStore.changeOrder('top') },
  //   { title: '一つ上に移動', func: () => SvgsStore.changeOrder('up') },
  //   { title: '一つ下に移動', func: () => SvgsStore.changeOrder('down') },
  //   { title: '最下面に移動', func: () => SvgsStore.changeOrder('bottom') },
  // ]

  // // オートセーブ
  // const autosave = debounce(function(){
  //   SvgsStore.updateSvgs()
  // }, 3000, { 'maxWait': 30000 })

  // watch(SvgsStore.allRects, () => autosave())
}
