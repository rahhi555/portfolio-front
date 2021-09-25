<template>
  <v-sheet
    ref="svgSheet"
    color="gray"
    elevation="6"
    height="50vh"
    style="touch-action: none;"
    @pointerdown.left="scrollBegin"
    @pointermove.prevent="scrollMiddle"
    @pointerup.left="scrollEnd"
    @wheel.prevent="zoomInOut"
  >
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
          />
          <line x1="0" y1="0" :x2="rect.width" y2="0" />
          <line :x1="rect.width" y1="0" :x2="rect.width" :y2="rect.height" />
          <line x1="0" :y1="rect.height" :x2="rect.width" :y2="rect.height" />
          <line x1="0" y1="0" x2="0" :y2="rect.height" />
        </g>
      </template>
    </svg>
    <p style="color: white;">{{viewBoxStr}}</p>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
} from '@nuxtjs/composition-api'
import { SvgsStore } from '~/store'
import { ViewBox } from '~/utils/helpers/viewbox'

export default defineComponent({
  setup() {
    const viewBox = new ViewBox

    const rects = computed(() => SvgsStore.activeMapRects)

    return {
      rects,
      svgSheet: viewBox.svgSheet,
      viewBoxStr: viewBox.viewBoxStr,
      scrollBegin: (e: MouseEvent) => viewBox.scrollBegin(e),
      scrollMiddle: (e: MouseEvent) => viewBox.scrollMiddle(e),
      scrollEnd: () => viewBox.scrollEnd(),
      zoomInOut: (e: WheelEvent) => viewBox.zoomInOut(e)
    }
  }
})
</script>
