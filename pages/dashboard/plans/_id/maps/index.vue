<template>
  <v-row>
    <v-col max-width="100%" rounded cols="12">
      <map-base></map-base>
    </v-col>

    <v-col class="py-0">
      <div class="text-center d-flex justify-sm-space-between align-center">
        <span>
          <v-btn @click="addRect">add</v-btn>
          <v-btn @click="updateSvgs">update</v-btn>
        </span>

        <template v-if="activeMap">
          <span>
            <v-chip>{{activeMap.name}}</v-chip>
            <v-pagination v-model="activeIndex" :length="maps.length" style="display: inline-block;"></v-pagination>
          </span>
        </template>
        <v-chip v-else disabled>マップがありません</v-chip>
      </div>
    </v-col>

    <map-modal></map-modal>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
} from '@nuxtjs/composition-api'
import { MapsStore, SvgsStore } from '~/store'
import MapBase from '~/components/protected/maps/MapBase.vue'
import MapModal from '~/components/protected/maps/MapModal.vue'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  components: {
    MapBase,
    MapModal,
  },

  layout: 'protected',

  middleware: [
    'initialize-store'
  ],

  setup() {
    setAppBarTabDialog('マップ作成')

    return {
      addRect: () => SvgsStore.addRect(),
      updateSvgs: () => SvgsStore.updateSvgs()
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
      get(){
        return MapsStore.activeIndex + 1
      },
      set(value){
        MapsStore.setActiveIndex(value - 1)
      }
    }
  },
})
</script>
