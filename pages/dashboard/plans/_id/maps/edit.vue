<template>
  <MapsUnApprovedBanner v-if="!accept" />

  <v-row v-else-if="$device.isDesktop && !isPlanActive" data-tutorial="attach-todo-list">
    <v-col cols="3">
      <MapsEditSideBar />
    </v-col>

    <v-col max-width="100%" rounded cols="9" style="position: relative">
      <MapsGoogleMap v-show="hasActiveMap" />
      <SvgsBase v-show="hasActiveMap" />
      
      <MapsFooterBase
        :justify-content="
          hasActiveMap ? 'justify-sm-space-between' : 'justify-end'
        "
      >
        <MapsFooterEdit v-if="hasActiveMap" />
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
export default {
  layout: 'protected',

  middleware: ['initialize-store'],

  head: {
    title: 'Map Edit'
  }
}
</script>

<script setup lang="ts">
import { MapsStore, PlansStore, MembersStore, TodoListsStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

    const isPlanActive = computed(() => PlansStore.currentPlan?.active)
    const accept = computed(() => MembersStore.currentUserAccept)

    if (!isPlanActive.value && accept.value) {
      setAppBarTabDialog('マップ作成')
    }

    onUnmounted(() => {
      TodoListsStore.setSelectedTodoListIndex(null)
    })

    const hasActiveMap = computed(() => !!MapsStore.activeMap)
</script>
