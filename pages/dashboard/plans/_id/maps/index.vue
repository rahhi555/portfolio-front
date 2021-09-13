<template>
  <v-row>
    <v-col max-width="100%" rounded cols="12">
      <map-edit></map-edit>
    </v-col>

    <map-page :justify-content="activeMap ? 'justify-sm-space-between' : 'justify-end'">
      <span v-if="activeMap">
        <v-btn @click="addRect">add</v-btn>
        <v-btn @click="updateSvgs">update</v-btn>
      </span>
    </map-page>

    <map-modal></map-modal>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { SvgsStore, MapsStore } from '~/store'
import MapEdit from '~/components/protected/maps/MapEdit.vue'
import MapModal from '~/components/protected/maps/MapModal.vue'
import MapPage from '~/components/protected/maps/MapPage.vue'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  components: {
    MapEdit,
    MapModal,
    MapPage,
  },

  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    setAppBarTabDialog('マップ作成')

    return {
      addRect: () => SvgsStore.addRect(),
      updateSvgs: () => SvgsStore.updateSvgs(),
    }
  },

  computed: {
    activeMap() {
      return MapsStore.activeMap
    }
  }
})
</script>
