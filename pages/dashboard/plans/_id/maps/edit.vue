<template>
  <v-row>
    <template v-if="$device.isDesktop">
      <v-col cols="3">
        <MapsEditSideBar />
      </v-col>

      <v-col max-width="100%" rounded cols="9">
        <SvgsBase />
        <MapsFooterBase
          :justify-content="
            hasActiveMap ? 'justify-sm-space-between' : 'justify-end'
          "
        >
          <MapsFooterEdit v-if="hasActiveMap" :has-active-map="hasActiveMap" />
        </MapsFooterBase>
      </v-col>
    </template>

    <div v-else class="ma-2" style="color: white">
      スマートフォンでのマップ編集は現在対応していません
    </div>

    <MapsModal />
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { MapsStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    setAppBarTabDialog('マップ作成')
  },

  computed: {
    hasActiveMap() {
      return !!MapsStore.activeMap
    },
  },
})
</script>
