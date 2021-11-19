import { ref, reactive } from '@nuxtjs/composition-api'
import { throttle } from 'mabiki'
import svgViewbox from './svg-viewbox'
import { MapsStore, SvgsStore, UserStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'
import SpaceKey from '~/utils/helpers/add-event-space-press'
import CommonUI from '~/utils/ui/common'

// Polyline挿入モード判定
const isAddPolylineMode = ref(false)

// Polyline作成中のターゲット
let targetPolyline = reactive<SvgParams>({})

export default {
  isAddPolylineMode,

  addPolylineStart(e: PointerEvent) {
    if(!isAddPolylineMode.value || SpaceKey.isSpaceKeyPress.value) return
    // リアルタイムに共有するPathはDBに保存しないため、重複しないようなidをランダムに作成する
    const MIN_ACTIVE_SVG_ID = 1_000_000_000_000_000

    // editページならdisplayTimeをなしにする
    const displayTime = CommonUI.isEditPage.value ? undefined : 4000

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

  // そのままだと滑らかすぎるので50msのスパンをおく
  addPolylineModeMiddle: throttle((e: PointerEvent) => {
    if(!isAddPolylineMode.value || !targetPolyline.id) return
    targetPolyline.drawPoints += `${(e.offsetX / svgViewbox.zoomParcentWidth())},${(e.offsetY / svgViewbox.zoomParcentHeight())} `
    SvgsStore.changeSvg({ status: 'drawPoints', value: targetPolyline.drawPoints!, otherTargetId: targetPolyline.id }) 
  }, 50),

  async addPolylineStop() {
    if(!isAddPolylineMode.value || !targetPolyline.id) return
    if(CommonUI.isEditPage.value) {
      const beforePolylineId = targetPolyline.id
      delete targetPolyline.id
      await SvgsStore.addSvg(targetPolyline)
      SvgsStore.deleteSvgMutation(beforePolylineId)
    } else {
      window.$nuxt.context.$planChannel[0].sendActiveSvg(targetPolyline)
    }
    targetPolyline = reactive<SvgParams>({})
  },
}