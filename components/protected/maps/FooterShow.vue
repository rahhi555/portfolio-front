<template>
  <span>
    <v-btn-toggle v-model="selected" dense>
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
import { isAddPathMode } from '~/utils/svgs/svg-add-path'
import { isAddPolylineMode } from '~/utils/svgs/svg-add-polyline'

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
          isAddPathMode.value = true
          isAddPolylineMode.value = false
          break
        case 1:
          isAddPathMode.value = false
          isAddPolylineMode.value = true
          break
        default:
          isAddPathMode.value = false
          isAddPolylineMode.value = false
          break
      }
    })

    return {
      selected,
    }
  },
})
</script>