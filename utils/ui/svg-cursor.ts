import { watchEffect, reactive, onMounted, computed } from '@nuxtjs/composition-api'
import SpaceKey from '~/utils/helpers/add-event-space-press'
import Path from '~/utils/svgs/svg-add-path'
import Polyline from '~/utils/svgs/svg-add-polyline'

const modes = reactive({
  isSpaceKeyPress: SpaceKey.isSpaceKeyPress,
  isPathMode: Path.isAddPathMode,
  isPolylineMode: Polyline.isAddPolylineMode,
})

const isSomeTrueModes = computed(() => {
  return modes.isPathMode || modes.isPolylineMode || modes.isSpaceKeyPress
})

const pathCursorStyle = `url(${require('@/assets/path.svg')}) 25 25, pointer`

const polylineCursorStyle = `url(${require('@/assets/marker.svg')}) 10 10, pointer`

export default {
  mounted() {
    onMounted(() => {
      watchEffect(() => {
        console.log('watchEffect')
        const svgBase = document.getElementById('svg-base')

        if (!svgBase) {
          return
        }

        const childSvgs = svgBase.querySelectorAll("[id ^= 'svg-']") as NodeListOf<HTMLElement>

        if (modes.isSpaceKeyPress) {
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

  isSomeTrueModes  
}
