<template>
  <span>
    <v-btn-toggle v-model="selected" dense>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn @click="addRect">
            <v-icon large v-bind="attrs" v-on="on"
              >mdi-rectangle-outline</v-icon
            >
          </v-btn>
        </template>
        <span>四角形</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn>
            <v-icon large v-bind="attrs" v-on="on">mdi-map-marker</v-icon>
          </v-btn>
        </template>
        <span>ピン</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn>
            <v-icon large v-bind="attrs" v-on="on">mdi-marker</v-icon>
          </v-btn>
        </template>
        <span>マーカー</span>
      </v-tooltip>
    </v-btn-toggle>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { SvgsStore } from '~/store'
import { SvgParams } from '~/store/modules/svgs'
import Path from '~/utils/svgs/svg-add-path'
import Polyline from '~/utils/svgs/svg-add-polyline'

export default defineComponent({
  props: {
    hasActiveMap: {
      type: Boolean,
    },
  },

  setup() {
    const selected = ref<number | undefined>(undefined)
    watch(selected, () => {
      switch (selected.value) {
        case 0:
          selected.value = undefined
          Path.isAddPathMode.value = false
          Polyline.isAddPolylineMode.value = false
          break
        case 1:
          Path.isAddPathMode.value = true
          Polyline.isAddPolylineMode.value = false
          break
        case 2:
          Path.isAddPathMode.value = false
          Polyline.isAddPolylineMode.value = true
          break
        default:
          Path.isAddPathMode.value = false
          Polyline.isAddPolylineMode.value = false
          break
      }
    })

    const addRect = () => {
      const rect: SvgParams = {
        type: 'Rect',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        name: 'new Rect',
      }
      SvgsStore.addSvg(rect)
    }

    return {
      addRect,
      selected,
    }
  },
})
</script>
