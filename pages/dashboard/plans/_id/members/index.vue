<template>
  <v-sheet v-if="!isPlanActive" color="white" elevation="1" max-height="85vh" class="overflow-y-auto pa-3">
    <v-row>
      <v-col v-for="member in members" :key="member.id" md="3" sm="4">
        <MembersCard :member="member" />
      </v-col>
    </v-row>

    <RolesModal />
  </v-sheet>

  <div v-else class="ma-2" style="color: white">計画実行中は編集できません</div>
</template>

<script lang="ts">
export default {
  layout: 'protected',

  middleware: ['initialize-store'],
}
</script>

<script setup lang="ts">
import { MembersStore, PlansStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

const isPlanActive = computed(() => PlansStore.currentPlan?.active)

if (!isPlanActive.value) {
  setAppBarTabDialog('ロール一覧')
}

const members = computed(() => MembersStore.members)
</script>
