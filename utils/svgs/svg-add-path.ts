import { ref, computed } from '@nuxtjs/composition-api'
import svgViewbox from './svg-viewbox'
import { MapsStore, SvgsStore, UserStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'
import SpaceKey from '~/utils/helpers/add-event-space-press'

// Path挿入モード判定
const isAddPathMode = ref(false)
// editページ判定
const isEditPage = computed(() => {
  if (process.server) return false
  return window.$nuxt.$route.name?.endsWith('edit')
})

// displayTimeのない永続的パス。editページで挿入
const addStaticPath = (e: PointerEvent) => {
  const path: SvgParams = {
    type: 'Path',
    x: e.offsetX / svgViewbox.zoomParcentWidth() - 25 + svgViewbox.minX.value,
    y: e.offsetY / svgViewbox.zoomParcentHeight() - 25 + svgViewbox.minY.value,
    name: 'new Static Path',
    drawPoints:
      'M44.5 15c0-8.271-6.729-15-15-15s-15 6.729-15 15c0 7.934 6.195 14.431 14 14.949v4.429c0 .553.448 3.56 1 3.56s1-3.007 1-3.56v-4.429c7.805-.518 14-7.015 14-14.949Z',
  }
  SvgsStore.addSvg(path)
}

// 4秒のみ表示し、actionCableでブロードキャストされるパス。showページで挿入
const sendActivePath = (e: PointerEvent) => {
  // リアルタイムに共有するPathはDBに保存しないため、重複しないようなidをランダムに作成する
  const MIN_ACTIVE_SVG_ID = 1_000_000_000_000_000
  const path: SvgParams = {
    id: Math.floor(
      Math.random() * (Number.MAX_SAFE_INTEGER - MIN_ACTIVE_SVG_ID + 1) +
        MIN_ACTIVE_SVG_ID
    ),
    type: 'Path',
    userId: UserStore.currentUser.id,
    mapId: MapsStore.activeMap.id,
    x: e.offsetX / svgViewbox.zoomParcentWidth() - 25 + svgViewbox.minX.value,
    y: e.offsetY / svgViewbox.zoomParcentHeight() - 25 + svgViewbox.minY.value,
    displayTime: 4000,
    drawPoints:
      'M44.5 15c0-8.271-6.729-15-15-15s-15 6.729-15 15c0 7.934 6.195 14.431 14 14.949v4.429c0 .553.448 3.56 1 3.56s1-3.007 1-3.56v-4.429c7.805-.518 14-7.015 14-14.949Z',
  }
  window.$nuxt.context.$planChannel[0].sendActiveSvg(path)
}

export default {
  isAddPathMode,

  // showページ、editページによって処理を切り替える
  addPath: (e: PointerEvent) => {
    if (SpaceKey.isSpaceKeyPress.value || !isAddPathMode.value) return
    if (isEditPage.value) {
      addStaticPath(e)
    } else {
      sendActivePath(e)
    }
  },
}
