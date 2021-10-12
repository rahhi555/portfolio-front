<template>
  <v-row>
    <v-col sm="3">
      <TodoListsBase />
    </v-col>
    <v-col sm="9">
      <TodosItems />
    </v-col>

    <TodoListsCreateModal />
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup(){
    setAppBarTabDialog('Todoリスト新規作成')
  
    return {

    }
  }
})
</script>