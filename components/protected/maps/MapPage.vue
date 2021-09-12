<template>
  <v-col class="py-0">
    <div :class="'text-center d-flex align-center map-page ' + justifyContent">
      <slot />

      <template v-if="activeMap">
        <span>
          <v-chip>{{ activeMap.name }}</v-chip>
          <v-pagination
            v-model="activeIndex"
            :length="maps.length"
            style="display: inline-block"
          ></v-pagination>
        </span>
      </template>
      <v-chip v-else disabled>マップがありません</v-chip>
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { MapsStore } from '~/store'

export default defineComponent({
  props: {
    justifyContent: {
      type: String,
      default: 'justify-start'
    }
  },

  computed: {
    maps() {
      return MapsStore.maps
    },
    activeMap() {
      return MapsStore.activeMap
    },
    activeIndex: {
      get() {
        return MapsStore.activeIndex + 1
      },
      set(value: number) {
        MapsStore.setActiveIndex(value - 1)
      },
    },
  },
})
</script>
