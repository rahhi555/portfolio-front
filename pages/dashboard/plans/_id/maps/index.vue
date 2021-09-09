<template>
  <v-row>
    <v-col max-width="100%" rounded cols="12">
      <map-base></map-base>
    </v-col>

    <v-col class="py-0">
      <div class="text-center d-flex justify-end align-center">
        <template v-if="selectMap">
          <v-chip>{{selectMap.name}}</v-chip>
          <v-pagination v-model="select" :length="maps.length"></v-pagination>
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
  ref,
  computed,
} from '@nuxtjs/composition-api'
import { PlansStore, MapsStore } from '~/store'
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
      await Promise.all([
        PlansStore.setCurrentPlan(planId),
        MapsStore.indexMaps(planId),
      ])
    })

    setAppBarTabDialog('マップ作成')

    const select = ref(1)
    const selectMap = computed(() => {
      return MapsStore.maps[select.value - 1 ]
    })

    return {
      select,
      selectMap,
    }
  },

  computed: {
    maps() {
      return MapsStore.maps
    }
  }
})
</script>
