<template>
  <v-row>
    <template v-if="$device.isDesktop">
      <v-col cols="3">
        <map-edit-side-bar></map-edit-side-bar>
      </v-col>

      <v-col max-width="100%" rounded cols="9">
        <svg-base></svg-base>
        <map-page
          :justify-content="
            activeMap ? 'justify-sm-space-between' : 'justify-end'
          "
        >
          <span v-if="activeMap">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon large dark v-bind="attrs" @click="addRect" v-on="on"
                  >mdi-rectangle-outline</v-icon
                >
              </template>
              <span>四角形</span>
            </v-tooltip>

            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon large dark v-bind="attrs" v-on="on">mdi-map-marker</v-icon>
              </template>
              <span>ピン</span>
            </v-tooltip>

            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon large dark v-bind="attrs" v-on="on">mdi-marker</v-icon>
              </template>
              <span>マーカー</span>
            </v-tooltip>
          </span>
        </map-page>
      </v-col>
    </template>

    <div v-else class="ma-2" style="color: white">
      スマートフォンでのマップ編集は現在対応していません
    </div>

    <map-modal></map-modal>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { SvgsStore, MapsStore } from '~/store'
import SvgBase from '~/components/protected/svgs/SvgBase.vue'
import MapModal from '~/components/protected/maps/MapModal.vue'
import MapPage from '~/components/protected/maps/MapPage.vue'
import MapEditSideBar from '~/components/protected/maps/MapEditSideBar.vue'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  components: {
    SvgBase,
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
    }
  },

  computed: {
    activeMap() {
      return MapsStore.activeMap
    },
  },
})
</script>
