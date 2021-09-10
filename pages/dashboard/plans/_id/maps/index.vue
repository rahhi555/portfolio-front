<template>
  <v-row>
    <v-col max-width="100%" rounded cols="12">
      <map-base></map-base>
    </v-col>

    <v-col class="py-0">
      <div class="text-center d-flex justify-end align-center">
        <template v-if="activeMap">
          <v-chip>{{activeMap.name}}</v-chip>
          <v-pagination v-model="activeIndex" :length="maps.length"></v-pagination>
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
  useFetch,
} from '@nuxtjs/composition-api'
import { MapsStore } from '~/store'
import { initializeStore } from '~/utils/helpers/store_helpers'
import MapBase from '~/components/protected/maps/MapBase.vue'
import MapModal from '~/components/protected/maps/MapModal.vue'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  components: {
    MapBase,
    MapModal,
  },

  layout: 'protected',

  setup() {
    useFetch(async ({ $route }) => {
      const planId = $route.params.id
      await initializeStore(planId)
    })

    setAppBarTabDialog('マップ作成')

    return {
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
