import { watchEffect, reactive, onMounted, computed } from '@nuxtjs/composition-api'
import { isSpaceKeyPress } from '~/utils/helpers/add-event-space-press'
import { isAddPathMode } from '~/utils/svgs/svg-add-path'
import { isAddPolylineMode } from '~/utils/svgs/svg-add-polyline'
import { MapsStore } from '~/store'

const pathCursorStyle = `url(${require('@/assets/path.svg')}) 25 25, pointer`

const polylineCursorStyle = `url(${require('@/assets/marker.svg')}) 10 10, pointer`

const activeMapEnabledGoogleMap = computed(() => {
  if (!MapsStore.activeMap) return false
  return MapsStore.activeMap.isGoogleMap
})

export const mounted = () => {
  onMounted(() => {
    watchEffect(() => {
      const svgBase = document.getElementById('svg-base')

      if (!svgBase) {
        return
      }

      const childSvgs = svgBase.querySelectorAll("[id ^= 'svg-']") as NodeListOf<HTMLElement>

      // スペースキーが押下され、現在のマップがグーグルマップを使用しない
      if (isSpaceKeyPress.value && !activeMapEnabledGoogleMap.value) {
        svgBase.style.cursor = 'move'
        childSvgs.forEach((svg) => {
          svg.style.cursor = 'move'
        })
      } else if (isAddPathMode.value) {
        svgBase.style.cursor = pathCursorStyle
        childSvgs.forEach((svg) => {
          svg.style.cursor = pathCursorStyle
        })
      } else if (isAddPolylineMode.value) {
        svgBase.style.cursor = polylineCursorStyle
        childSvgs.forEach((svg) => {
          svg.style.cursor = polylineCursorStyle
        })
      } else {
        svgBase.style.cursor = ''
        childSvgs.forEach((svg) => {
          svg.style.cursor = ''
        })
      }
    })
  })
}

export const isSomeTrueModes = computed(() => {
  return isAddPathMode.value || isAddPolylineMode.value || isSpaceKeyPress.value
})

export const isAddModes = computed(() => {
  return isAddPathMode.value || isAddPolylineMode.value
})
