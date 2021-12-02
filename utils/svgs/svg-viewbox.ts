import {
  computed,
  ref,
  onMounted,
  watch,
} from '@nuxtjs/composition-api'
import { MapsStore, SnackbarStore } from '~/store'

// svgSheetは$refsで取得したv-sheetを格納するためのプロパティ
const svgSheet = ref<Vue | null>(null)
// 初期状態のwidth及びheight
const defaultWidth = ref(0)
const defaultHeight = ref(0)
const minX = ref(0)
const minY = ref(0)
const width = ref(0)
const height = ref(0)
let isScrolling = false
const startPoint = { x: 0, y: 0 }

const zoom = (scale: number) => {
  // 大きさをscale倍する
  const zoomedWidth = width.value * scale
  const zoomedHeight = height.value * scale

  // 中心の座標を計算する
  const centerX = minX.value + width.value / 2.0
  const centerY = minY.value + height.value / 2.0

  // scale倍したあとのmin-xとmin-yを計算する
  const zoomedMinX = centerX - zoomedWidth / 2.0
  const zoomedMinY = centerY - zoomedHeight / 2.0

  // viewBoxを更新
  minX.value = zoomedMinX
  minY.value = zoomedMinY
  width.value = zoomedWidth
  height.value = zoomedHeight
}

// ビューボックスを初期状態にする
const reset = () => {
  minX.value = 0
  minY.value = 0
  width.value = defaultWidth.value
  height.value = defaultHeight.value
}

// activeMapをwatchするためcomputedで定義
const activeMap = computed(() => MapsStore.activeMap)

// pointerEventでマルチタップを検出するためのログ配列
let evCache: PointerEvent[] = []

export default {
  svgSheet,

  minX,

  minY,

  defaultWidth,

  defaultHeight,

  mounted() {
    onMounted(() => {
      const svgSheetEl = svgSheet.value?.$el as HTMLDivElement
      if(!svgSheetEl) SnackbarStore.visible({ color: 'error', message: 'シート初期化に失敗しました' })

      // マップが一件も無いときはv-showで隠しているが、その状態だとwidthとheightが取得できないため
      // 一旦表示させて値を取得してから再度隠す
      const isSvgSheetDisplayNone = svgSheetEl.style.display === 'none'
      if(isSvgSheetDisplayNone) svgSheetEl.style.display = ''
      defaultWidth.value =
        MapsStore.activeMap?.width || svgSheet.value!.$el.clientWidth
      defaultHeight.value =
        MapsStore.activeMap?.height || svgSheet.value!.$el.clientHeight
      width.value = defaultWidth.value
      height.value = defaultHeight.value
      if(isSvgSheetDisplayNone) svgSheetEl.style.display = 'none'
      watch(activeMap,  reset)
    })
  },

  zoomParcentWidth() {
    return svgSheet.value!.$el.clientWidth / width.value
  },

  zoomParcentHeight() {
    return svgSheet.value!.$el.clientHeight / height.value
  },

  viewBoxStr() {
    return computed(() => {
      return `${minX.value} ${minY.value} ${width.value} ${height.value}`
    })
  },

  scrollBegin(e: PointerEvent) {
    // グーグルマップが有効の場合、スクロールは無効にする
    if (MapsStore.activeMap.isGoogleMap) return
    if (e.pointerType === 'touch') evCache.push(e)

    isScrolling = true
    startPoint.x = e.clientX - minX.value
    startPoint.y = e.clientY - minY.value
  },

  scrollMiddle(e: PointerEvent) {
    if (!isScrolling) return

    // 2本指でタッチしている場合evCache.lengthが2になるので、その場合はスクロールしない
    if (e.pointerType === 'touch' && evCache.length > 1) {
      return
    }

    const newX = e.clientX - startPoint.x
    const newY = e.clientY - startPoint.y
    minX.value = newX
    minY.value = newY
  },

  scrollEnd() {
    evCache = []
    isScrolling = false
    startPoint.x = 0
    startPoint.y = 0
  },

  /**
   * 引数eとしてWheelEventまたはnumberを渡し、ズームイン・アウトを実行する
   * (numberを渡す場合は0未満ならズームアウト、0以上ならズームインになる)
   */
  zoomInOut(e: WheelEvent | number) {
    // グーグルマップが有効の場合、ズームイン・アウトは無効にする
    if (MapsStore.activeMap.isGoogleMap) return

    let deltaY: number
    if (typeof e === 'number') {
      deltaY = e
    } else {
      deltaY = e.deltaY
    }

    const SCALE = 1.1
    if (deltaY < 0) {
      zoom(1 / SCALE)
    } else if (deltaY > 0) {
      zoom(SCALE)
    }
  },

  reset,
}
