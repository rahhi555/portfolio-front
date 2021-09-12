<template>
  <v-sheet color="gray" elevation="6" height="50vh">
    <svg
      id="mysvg-show"
      x="0"
      y="0"
      width="100%"
      height="100%"
      viewBow="0 0 100% 100%"
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
          <line
            x1="0"
            y1="0"
            :x2="rect.width"
            y2="0"
          />
          <line
            :x1="rect.width"
            y1="0"
            :x2="rect.width"
            :y2="rect.height"
          />
          <line
            x1="0"
            :y1="rect.height"
            :x2="rect.width"
            :y2="rect.height"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            :y2="rect.height"
          />
        </g>
      </template>
    </svg>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
} from '@nuxtjs/composition-api'
import { SvgsStore } from '~/store'

export default defineComponent({
  setup() {
    const rects = computed(() => SvgsStore.activeMapRects)
    return {
      rects,
    }
  },
})
</script>

<style scope>
</style>
