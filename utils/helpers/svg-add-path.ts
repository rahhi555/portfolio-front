import { ref } from '@nuxtjs/composition-api'
import svgViewbox from './svg-viewbox'
import { SvgsStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'

const isAddPathMode = ref(false)

export default {
  isAddPathMode,

  addPath: (e: PointerEvent) => {
    const path: SvgParams = {
      type: 'Path',
      x: (e.offsetX / svgViewbox.zoomParcentWidth()) - 15 + svgViewbox.minX.value,
      y: (e.offsetY / svgViewbox.zoomParcentHeight()) - 15 + svgViewbox.minY.value,
      name: 'new Path',
      drawPoints:
        "M44.5 15c0-8.271-6.729-15-15-15s-15 6.729-15 15c0 7.934 6.195 14.431 14 14.949v4.429c0 .553.448 3.56 1 3.56s1-3.007 1-3.56v-4.429c7.805-.518 14-7.015 14-14.949Z",
    }
    SvgsStore.addSvg(path)
  },
}
