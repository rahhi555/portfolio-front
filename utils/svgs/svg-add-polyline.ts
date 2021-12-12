import { ref, reactive } from '@nuxtjs/composition-api'
import { throttle } from 'mabiki'
import simplify from 'simplify-js'
import svgViewbox from './svg-viewbox'
import { MapsStore, SvgsStore, UserStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'
import SpaceKey from '~/utils/helpers/add-event-space-press'
import CommonUI from '~/utils/ui/common'

// Polyline挿入モード判定
const isAddPolylineMode = ref(false)

// Polyline作成中のターゲット
let targetPolyline = reactive<SvgParams>({})

// 最終的にsimplifyメソッドで綺麗にするための配列
const targetPolylineArray: { x: number, y: number }[] = []

// ズーム計算後のxかyを返す
const calculateZoom = {
  x: (e: PointerEvent) => { return e.offsetX / svgViewbox.zoomParcentWidth() },
  y: (e: PointerEvent) => { return e.offsetY / svgViewbox.zoomParcentHeight() }
}

export default {
  isAddPolylineMode,

  addPolylineStart(e: PointerEvent) {
    if(!isAddPolylineMode.value || SpaceKey.isSpaceKeyPress.value) return
    // リアルタイムに共有するPathはDBに保存しないため、重複しないようなidをランダムに作成する
    const MIN_ACTIVE_SVG_ID = 1_000_000_000_000_000

    // editページならdisplayTimeをなしにする
    const displayTime = CommonUI.isEditPage.value ? undefined : 4000

    targetPolylineArray.push({ x: calculateZoom.x(e), y: calculateZoom.y(e) })

    targetPolyline.id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - MIN_ACTIVE_SVG_ID + 1) + MIN_ACTIVE_SVG_ID)
    targetPolyline.type = 'Polyline'
    targetPolyline.x = svgViewbox.minX.value
    targetPolyline.y = svgViewbox.minY.value
    targetPolyline.displayTime = displayTime
    targetPolyline.drawPoints = `${calculateZoom.x(e)},${calculateZoom.y(e)} `
    targetPolyline.mapId = MapsStore.activeMap.id
    targetPolyline.name = UserStore.currentUser.name
      
    // @ts-ignore
    SvgsStore.addSvgMutation(Object.assign({}, targetPolyline))
  },

  // そのままだと滑らかすぎるので50msのスパンをおく
  addPolylineModeMiddle: throttle((e: PointerEvent) => {
    if(!isAddPolylineMode.value || !targetPolyline.id) return

    targetPolylineArray.push({ x: calculateZoom.x(e), y: calculateZoom.y(e) })
    targetPolyline.drawPoints += `${calculateZoom.x(e)},${calculateZoom.y(e)} `
    SvgsStore.changeSvg({ status: 'drawPoints', value: targetPolyline.drawPoints!, otherTargetId: targetPolyline.id }) 
  }, 50),

  async addPolylineStop() {
    if(!isAddPolylineMode.value || !targetPolyline.id) return

    const simplified = simplify(targetPolylineArray, 10)

    targetPolyline.drawPoints = simplified.map(v => `${v.x},${v.y} `).join('')
    SvgsStore.changeSvg({ status: 'drawPoints', value: targetPolyline.drawPoints!, otherTargetId: targetPolyline.id }) 

    if(CommonUI.isEditPage.value) {
      SvgsStore.deleteSvgMutation(targetPolyline.id)
      delete targetPolyline.id
      // @ts-ignore
      await SvgsStore.addSvg(targetPolyline)
    } else {
      // @ts-ignore
      window.$nuxt.context.$planChannelPeformMethods('sendActiveSvg', targetPolyline)
    }
    targetPolyline = reactive<SvgParams>({})
    targetPolylineArray.length = 0
  },
}