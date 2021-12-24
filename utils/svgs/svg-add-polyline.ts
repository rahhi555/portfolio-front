import { ref, reactive } from '@nuxtjs/composition-api'
import { throttle } from 'mabiki'
import simplify from 'simplify-js'
import { zoomParcentHeight, zoomParcentWidth, minX, minY } from './svg-viewbox'
import { MapsStore, SvgsStore, UserStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'
import { isSpaceKeyPress } from '~/utils/helpers/add-event-space-press'
import { isEditPage } from '~/utils/ui/common'

// Polyline作成中のターゲット
let targetPolyline = reactive<SvgParams>({})

// 最終的にsimplifyメソッドで綺麗にするための配列
const targetPolylineArray: { x: number; y: number }[] = []

// ズーム計算後のxかyを返す
const calculateZoom = {
  x: (e: PointerEvent) => {
    return e.offsetX / zoomParcentWidth()
  },
  y: (e: PointerEvent) => {
    return e.offsetY / zoomParcentHeight()
  },
}

// Polyline挿入モード判定
export const isAddPolylineMode = ref(false)

export const addPolylineStart = (e: PointerEvent) => {
  if (!isAddPolylineMode.value || isSpaceKeyPress.value) return
  // リアルタイムに共有するPathはDBに保存しないため、重複しないようなidをランダムに作成する
  const MIN_ACTIVE_SVG_ID = 1_000_000_000_000_000

  // editページならdisplayTimeをなしにする
  const displayTime = isEditPage.value ? undefined : 4000

  targetPolylineArray.push({ x: calculateZoom.x(e), y: calculateZoom.y(e) })

  targetPolyline.id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - MIN_ACTIVE_SVG_ID + 1) + MIN_ACTIVE_SVG_ID)
  targetPolyline.type = 'Polyline'
  targetPolyline.x = minX.value
  targetPolyline.y = minY.value
  targetPolyline.displayTime = displayTime
  targetPolyline.drawPoints = `${calculateZoom.x(e)},${calculateZoom.y(e)} `
  targetPolyline.mapId = MapsStore.activeMap.id
  targetPolyline.name = UserStore.currentUser.name

  // @ts-ignore
  SvgsStore.addSvgMutation(Object.assign({}, targetPolyline))
}

// そのままだと滑らかすぎるので50msのスパンをおく
export const addPolylineMiddle = throttle((e: PointerEvent) => {
  if (!isAddPolylineMode.value || !targetPolyline.id) return

  targetPolylineArray.push({ x: calculateZoom.x(e), y: calculateZoom.y(e) })
  targetPolyline.drawPoints += `${calculateZoom.x(e)},${calculateZoom.y(e)} `
  SvgsStore.changeSvg({ status: 'drawPoints', value: targetPolyline.drawPoints!, otherTargetId: targetPolyline.id })
}, 50)

export const addPolylineStop = async () => {
  if (!isAddPolylineMode.value || !targetPolyline.id) return

  const simplified = simplify(targetPolylineArray, 10)

  targetPolyline.drawPoints = simplified.map((v) => `${v.x},${v.y} `).join('')
  SvgsStore.changeSvg({ status: 'drawPoints', value: targetPolyline.drawPoints!, otherTargetId: targetPolyline.id })

  if (isEditPage.value) {
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
}
