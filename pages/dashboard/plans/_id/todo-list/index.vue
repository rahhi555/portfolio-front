<template>
  <v-row>
    <v-col cols="3">
      <todo-lists />
    </v-col>
    <v-col cols="9">
      <todos />
    </v-col>

    <todo-list-create-modal />
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TodoLists from '~/components/protected/todos/TodoLists.vue'
import Todos from '~/components/protected/todos/Todos.vue'
import TodoListCreateModal from '~/components/protected/todos/TodoListCreateModal.vue'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  components: {
    TodoLists,
    Todos,
    TodoListCreateModal
  },

  layout: 'protected',

  middleware: ['initialize-store'],

  setup(){
    setAppBarTabDialog('Todoリスト新規作成')
  
    return {

    }
  }
})
</script>