<template>
  <v-row v-if="!isPlanActive">
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
import { PlansStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup(){
    const isPlanActive = computed(() => PlansStore.currentPlan?.active)
    if(!isPlanActive.value) {
      setAppBarTabDialog('Todoリスト新規作成')
    }

    return {
      isPlanActive
    }
  },
})
</script>