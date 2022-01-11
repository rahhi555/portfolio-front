<template>
  <span>
    <v-btn-toggle v-model="selected" :class="{ 'show-page-btns': isShowPage }">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn>
            <v-icon v-bind="attrs" v-on="on">mdi-map-marker</v-icon>
          </v-btn>
        </template>
        <span>ピン</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn>
            <v-icon v-bind="attrs" v-on="on">mdi-marker</v-icon>
          </v-btn>
        </template>
        <span>マーカー</span>
      </v-tooltip>
    </v-btn-toggle>
  </span>
</template>

<script setup lang="ts">
import { isAddPathMode } from '~/utils/svgs/svg-add-path'
import { isAddPolylineMode } from '~/utils/svgs/svg-add-polyline'
import { isShowPage } from '~/utils/ui/common'

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
</script>

<style scoped>
.show-page-btns {
  flex-direction: column;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
</style>
