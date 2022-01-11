<template>
  <v-col class="py-1">
    <div :class="'text-center d-flex align-center map-page ' + justifyContent">
      <slot />

      <span v-if="activeMap">
        <v-chip :style="{'max-width': isSpacer ? '100%' : '45%'}">{{ activeMap.name }}</v-chip>
        <v-spacer v-if="isSpacer" class="my-4"></v-spacer>
        <v-pagination
          v-model="activeIndex"
          :length="maps.length"
          style="display: inline-block;"
          :total-visible="5"
        ></v-pagination>
      </span>
    </div>

    <v-banner v-if="!activeMap" color="info" icon="mdi-alert-circle-outline">マップが作成されていません</v-banner>
  </v-col>
</template>

<script setup lang="ts">
import { MapsStore } from '~/store'

withDefaults(defineProps<{ justifyContent: string, isSpacer: boolean }>(), {
  justifyContent: 'justify-start',
  isSpacer: false
})

const maps = computed(() => MapsStore.maps)

const activeMap = computed(() => MapsStore.activeMap)

const activeIndex = computed({
  get: () => MapsStore.activeIndex + 1,
  set: (value: number) => MapsStore.setActiveIndex(value - 1)
})
</script>

<style scoped>
/deep/ .v-pagination__more{
  color: white;
}
</style>