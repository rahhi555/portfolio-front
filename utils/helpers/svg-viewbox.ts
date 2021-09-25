import { computed, ref, Ref, onMounted } from '@nuxtjs/composition-api'

export class ViewBox {
  // svgSheetは$refsで取得したv-sheetを格納するためのプロパティ
  public svgSheet: Ref<Vue | null>
  private minX: Ref<number>;
  private minY: Ref<number>;
  private width: Ref<number>;
  private height: Ref<number>;
  private isScrolling: boolean
  private startPoint: { x: number, y: number }

  constructor() {
    this.svgSheet = ref(null)
    this.minX = ref(0)
    this.minY = ref(0)
    this.width = ref(0)
    this.height = ref(0)
    this.isScrolling = false
    this.startPoint = { x: 0, y: 0 }
  }

  private mounted = onMounted(() => {
    this.width.value = this.svgSheet.value!.$el.clientWidth
    this.height.value = this.svgSheet.value!.$el.clientHeight
  })

  public viewBoxStr = computed(() => {
    return `${this.minX.value} ${this.minY.value} ${this.width.value} ${this.height.value}`
  })

  public scrollBegin = (e: MouseEvent) => {
    this.isScrolling = true
    this.startPoint.x = e.clientX - this.minX.value
    this.startPoint.y = e.clientY - this.minY.value
  }

  public scrollMiddle = (e: MouseEvent) => {
    if(!this.isScrolling) return
    const newX = e.clientX - this.startPoint.x
    const newY = e.clientY - this.startPoint.y
    this.minX.value = newX
    this.minY.value = newY
  }

  public scrollEnd = () => {
    this.isScrolling = false
    this.startPoint.x = 0
    this.startPoint.y = 0
  }

  private zoom = (scale: number) => {
    // 大きさをscale倍する
    const zoomedWidth = this.width.value * scale
    const zoomedHeight = this.height.value * scale

    // 中心の座標を計算する
    const centerX = this.minX.value + this.width.value / 2.0
    const centerY = this.minY.value + this.height.value / 2.0

    // scale倍したあとのmin-xとmin-yを計算する
    const zoomedMinX = centerX - zoomedWidth / 2.0;
    const zoomedMinY = centerY - zoomedHeight / 2.0;
    
    // viewBoxを更新
    this.minX.value = zoomedMinX
    this.minY.value = zoomedMinY
    this.width.value = zoomedWidth
    this.height.value = zoomedHeight
  }

  public zoomInOut = (e: WheelEvent | { deltaY: number }) => {
    const SCALE = 1.1
    if(e.deltaY < 0) {
      this.zoom(1 / SCALE)
    } else if (e.deltaY > 0) {
      this.zoom(SCALE)
    }
  }
}