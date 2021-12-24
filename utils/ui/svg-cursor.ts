import { watchEffect, reactive, onMounted, computed } from '@nuxtjs/composition-api'
import { isSpaceKeyPress } from '~/utils/helpers/add-event-space-press'
import Path from '~/utils/svgs/svg-add-path'
import { isAddPolylineMode } from '~/utils/svgs/svg-add-polyline'
import { MapsStore } from '~/store'

const modes = reactive({
  isSpaceKeyPress: isSpaceKeyPress,
  isPathMode: Path.isAddPathMode,
  isPolylineMode: isAddPolylineMode,
})

const isSomeTrueModes = computed(() => {
  return modes.isPathMode || modes.isPolylineMode || modes.isSpaceKeyPress
})

const isAddModes = computed(() => {
  return modes.isPathMode || modes.isPolylineMode
})

const pathCursorStyle = `url(${require('@/assets/path.svg')}) 25 25, pointer`

const polylineCursorStyle = `url(${require('@/assets/marker.svg')}) 10 10, pointer`

const activeMapEnabledGoogleMap = computed(() => {
  if(!MapsStore.activeMap) return false
  return MapsStore.activeMap.isGoogleMap
})

export default {
  mounted() {
    onMounted(() => {
      watchEffect(() => {
        const svgBase = document.getElementById('svg-base')

        if (!svgBase) {
          return
        }

        const childSvgs = svgBase.querySelectorAll("[id ^= 'svg-']") as NodeListOf<HTMLElement>

        // スペースキーが押下され、現在のマップがグーグルマップを使用しない
        if (modes.isSpaceKeyPress && !activeMapEnabledGoogleMap.value) {
          svgBase.style.cursor = 'move'
          childSvgs.forEach(svg => { svg.style.cursor = 'move' })    
        } else if (modes.isPathMode) {
          svgBase.style.cursor = pathCursorStyle
          childSvgs.forEach(svg => { svg.style.cursor = pathCursorStyle })
        } else if (modes.isPolylineMode) {
          svgBase.style.cursor = polylineCursorStyle
          childSvgs.forEach(svg => { svg.style.cursor = polylineCursorStyle })
        } else {
          svgBase.style.cursor = ''
          childSvgs.forEach(svg => { svg.style.cursor = '' })
        }
      })
    })
  },

  isSomeTrueModes,

  isAddModes
}
