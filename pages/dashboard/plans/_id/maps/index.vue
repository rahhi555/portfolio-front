<template>
  <v-row>
    <template v-if="$device.isDesktop">
      <v-col cols="3">
        <map-edit-side-bar></map-edit-side-bar>
      </v-col>

      <v-col max-width="100%" rounded cols="9">
        <map-edit></map-edit>
        <map-page
          :justify-content="
            activeMap ? 'justify-sm-space-between' : 'justify-end'
          "
        >
          <span v-if="activeMap">
            <v-btn @click="addRect">図形追加</v-btn>
          </span>
        </map-page>
      </v-col>
    </template>

    <div class="ma-2" v-else style="color: white;">スマートフォンでのマップ編集は現在対応していません</div>

    <map-modal></map-modal>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { SvgsStore, MapsStore } from '~/store'
import MapEdit from '~/components/protected/maps/MapEdit.vue'
import MapModal from '~/components/protected/maps/MapModal.vue'
import MapPage from '~/components/protected/maps/MapPage.vue'
import MapEditSideBar from '~/components/protected/maps/MapEditSideBar.vue'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  components: {
    MapEdit,
    MapModal,
    MapPage,
    MapEditSideBar,
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
    },
  },
})
</script>
