import { computed, ref, onMounted } from '@nuxtjs/composition-api'

// svgSheetは$refsで取得したv-sheetを格納するためのプロパティ
const svgSheet = ref<Vue | null>(null)
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

export default {
  svgSheet,

  mounted() {
    onMounted(() => {
      width.value = svgSheet.value!.$el.clientWidth
      height.value = svgSheet.value!.$el.clientHeight
    })
  },

  viewBoxStr() {
    return computed(() => {
      return `${minX.value} ${minY.value} ${width.value} ${height.value}`
    })
  },

  scrollBegin(e: MouseEvent) {
    isScrolling = true
    startPoint.x = e.clientX - minX.value
    startPoint.y = e.clientY - minY.value
  },

  scrollMiddle(e: MouseEvent) {
    if (!isScrolling) return
    const newX = e.clientX - startPoint.x
    const newY = e.clientY - startPoint.y
    minX.value = newX
    minY.value = newY
  },

  scrollEnd() {
    isScrolling = false
    startPoint.x = 0
    startPoint.y = 0
  },

  zoomInOut(e: WheelEvent | { deltaY: number }) {
    const SCALE = 1.1
    if (e.deltaY < 0) {
      zoom(1 / SCALE)
    } else if (e.deltaY > 0) {
      zoom(SCALE)
    }
  },
}
