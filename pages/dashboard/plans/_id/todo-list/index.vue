<template>
  <MapsUnApprovedBanner v-if="!accept" />

  <v-row v-else-if="!isPlanActive">
    <v-col sm="3">
      <TodoListsBase />
    </v-col>
    <v-col sm="9">
      <TodosItems />
    </v-col>

    <TodoListsCreateModal />
  </v-row>

  <div v-else class="ma-2" style="color: white">
    計画実行中は編集できません
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { MembersStore, PlansStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup(){
    const isPlanActive = computed(() => PlansStore.currentPlan?.active)
    const accept = computed(() => MembersStore.currentUserAccept)
    if(!isPlanActive.value && accept.value) {
      setAppBarTabDialog('Todoリスト新規作成')
    }

    return {
      isPlanActive,
      accept
    }
  },
})
</script>