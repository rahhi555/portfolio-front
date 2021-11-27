<template>
  <MapsUnApprovedBanner v-if="!accept" />

  <v-row v-else-if="$device.isDesktop && !isPlanActive">
    <v-col cols="3">
      <MapsEditSideBar />
    </v-col>

    <v-col max-width="100%" rounded cols="9" style="position: relative">
      <MapsGoogleMap />
      <SvgsBase />
      <MapsFooterBase
        :justify-content="
          hasActiveMap ? 'justify-sm-space-between' : 'justify-end'
        "
      >
        <MapsFooterEdit v-if="hasActiveMap" :has-active-map="hasActiveMap" />
      </MapsFooterBase>
    </v-col>

    <MapsModal />
  </v-row>

  <div v-else-if="isPlanActive" class="ma-2" style="color: white">
    計画実行中は編集できません
  </div>

  <div v-else-if="$device.isMobile" class="ma-2" style="color: white">
    スマートフォンでのマップ編集は現在対応していません
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { MapsStore, PlansStore, MembersStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    const isPlanActive = computed(() => PlansStore.currentPlan?.active)
    const accept = computed(() => MembersStore.currentUserAccept)

    if (!isPlanActive.value && accept.value) {
      setAppBarTabDialog('マップ作成')
    }
    
    return {
      isPlanActive,
      hasActiveMap: computed(() => !!MapsStore.activeMap),
      accept
    }
  },
})
</script>
