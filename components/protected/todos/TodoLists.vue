<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-list dense>
      <v-subheader>Todoリスト</v-subheader>

      <v-list-item-group
        v-if="todoLists.length"
        v-model="selectedTodoList"
        color="primary"
      >
        <v-list-item v-for="todoList in todoLists" :key="todoList.id">
          <todo-list-item :todo-list="todoList"/>
        </v-list-item>
      </v-list-item-group>

      <v-list-item v-else>Empty Todo List</v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { TodoListsStore } from '~/store'
import TodoListItem from '~/components/protected/todos/TodoListItem.vue'

export default defineComponent({
  components: {
    TodoListItem
  },

  computed: {
    todoLists() {
      return TodoListsStore.todoList
    },
    selectedTodoList: {
      get() {
        return TodoListsStore.selectedTodoList
      },
      set(value) {
        TodoListsStore.setSelectedTodoList(value)
      },
    },
  },
})
</script>
