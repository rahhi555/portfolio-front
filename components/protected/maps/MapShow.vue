<template>
  <v-sheet color="gray" elevation="6" height="70vh">
    <svg
      id="mysvg-show"
      width="100%"
      height="100%"
      :viewBox="viewBoxStr"
      xmlns="http://www.w3.org/2000/svg"
    >
      <template v-for="rect in rects">
        <g
          :id="'rect-' + rect.id"
          :key="rect.id"
          :transform="'translate(' + rect.x + ',' + rect.y + ')'"
        >
          <rect
            :width="rect.width"
            :height="rect.height"
            :fill="rect.fill"
            :stroke="rect.stroke"
            tabindex="0"
          />
          <line x1="0" y1="0" :x2="rect.width" y2="0" />
          <line :x1="rect.width" y1="0" :x2="rect.width" :y2="rect.height" />
          <line x1="0" :y1="rect.height" :x2="rect.width" :y2="rect.height" />
          <line x1="0" y1="0" x2="0" :y2="rect.height" />
        </g>
      </template>
    </svg>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { SvgsStore } from '~/store'

export default defineComponent({
  setup() {
    const rects = computed(() => SvgsStore.activeMapRects)

    const viewBox = reactive({
      minX: 140,
      minY: 0,
      width: 870,
      height: 530,
    })
    const viewBoxStr = computed(() => {
      return `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`
    })

    const scale = ref(1)

    const zoomIn = () => {
      scale.value += 0.1
    }

    const zoomOut = () => {
      scale.value -= 0.1
    }
    return {
      rects,
      scale,
      zoomIn,
      zoomOut,
      viewBoxStr,
    }
  },
})
</script>

<style scope></style>
