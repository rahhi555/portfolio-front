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
import Path from '~/utils/helpers/svg-add-path'

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
          Path.isAddPathMode.value = true
          break
        case 1:
          Path.isAddPathMode.value = true
          break
        default:
          Path.isAddPathMode.value = false
          break
      }
    })

    return {
      selected,
    }
  },
})
</script>