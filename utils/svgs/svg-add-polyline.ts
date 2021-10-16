import { ref, reactive } from '@nuxtjs/composition-api'
import svgViewbox from './svg-viewbox'
import { MapsStore, SvgsStore, UserStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'

// Polyline挿入モード判定
const isAddPolylineMode = ref(false)

const polyline = reactive<SvgParams>({
  id: 0,
  type: 'Polyline',
  x: 0,
  y: 0,
  displayTime: 4000,
  drawPoints: '',
  userId: UserStore.currentUser.id,
})

export default {
  isAddPolylineMode,

  addPolylineStart(e: PointerEvent) {
    isAddPolylineMode.value = true
    // リアルタイムに共有するPathはDBに保存しないため、重複しないようなidをランダムに作成する
    const MIN_ACTIVE_SVG_ID = 1_000_000_000_000_000
    polyline.id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - MIN_ACTIVE_SVG_ID + 1) + MIN_ACTIVE_SVG_ID)
    polyline.mapId = MapsStore.activeMap.id
    polyline.x = (e.offsetX / svgViewbox.zoomParcentWidth()) - 10 + svgViewbox.minX.value
    polyline.y = (e.offsetY / svgViewbox.zoomParcentHeight()) - 10 + svgViewbox.minY.value
    polyline.drawPoints = `${e.offsetX},${e.offsetY} `
    // @ts-ignore
    SvgsStore.addSvgMutation(polyline)
  },
}