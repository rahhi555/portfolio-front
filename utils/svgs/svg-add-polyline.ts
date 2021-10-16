import { ref, reactive, computed } from '@nuxtjs/composition-api'
import svgViewbox from './svg-viewbox'
import { MapsStore, SvgsStore, UserStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'
import SpaceKey from '~/utils/helpers/add-event-space-press'

// Polyline挿入モード判定
const isAddPolylineMode = ref(false)

// editページ判定
const isEditPage = computed(() => {
  if (process.server) return false
  return window.$nuxt.$route.name?.endsWith('edit')
})

// Polyline作成中のターゲット
let targetPolyline = reactive<SvgParams>({})

export default {
  isAddPolylineMode,

  addPolylineStart(e: PointerEvent) {
    if(!isAddPolylineMode.value || SpaceKey.isSpaceKeyPress.value) return
    // リアルタイムに共有するPathはDBに保存しないため、重複しないようなidをランダムに作成する
    const MIN_ACTIVE_SVG_ID = 1_000_000_000_000_000

    // editページならdisplayTimeをなしにする
    const displayTime = isEditPage.value ? undefined : 4000

    targetPolyline.id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - MIN_ACTIVE_SVG_ID + 1) + MIN_ACTIVE_SVG_ID)
    targetPolyline.type = 'Polyline'
    targetPolyline.x = svgViewbox.minX.value
    targetPolyline.y = svgViewbox.minY.value
    targetPolyline.displayTime = displayTime
    targetPolyline.drawPoints = `${(e.offsetX / svgViewbox.zoomParcentWidth())},${(e.offsetY / svgViewbox.zoomParcentHeight())} `
    targetPolyline.userId = UserStore.currentUser.id
    targetPolyline.mapId = MapsStore.activeMap.id
    targetPolyline.name = 'new Polyline'
      
    // @ts-ignore
    SvgsStore.addSvgMutation(Object.assign({}, targetPolyline))
  },

  addPolylineModeMiddle(e: PointerEvent) {
    if(!isAddPolylineMode.value || !targetPolyline.id) return
    targetPolyline.drawPoints += `${(e.offsetX / svgViewbox.zoomParcentWidth())},${(e.offsetY / svgViewbox.zoomParcentHeight())} `
    SvgsStore.changeSvg({ status: 'drawPoints', value: targetPolyline.drawPoints!, otherTargetId: targetPolyline.id }) 
  },

  async addPolylineStop() {
    if(!isAddPolylineMode.value || !targetPolyline.id) return
    if(isEditPage.value) {
      const beforePolylineId = targetPolyline.id
      delete targetPolyline.id
      await SvgsStore.addSvg(targetPolyline)
      SvgsStore.deleteSvgMutation(beforePolylineId)
    } else {
      window.$nuxt.context.$planChannel[0].sendActiveSvg(targetPolyline)
    }
    targetPolyline = reactive<SvgParams>({})
  }
}