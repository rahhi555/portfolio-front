<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-list dense>
      <v-list-group v-if="todoLists.length" :value="true">
          <template #activator>
              <v-list-item-title>Todoリスト</v-list-item-title>
          </template>

        <v-list-item-group
          v-model="selectedTodoListIndex"
          color="primary"
        >
          <v-list-item v-for="todoList in todoLists" :key="todoList.id">
            <TodoListsItem :todo-list="todoList"/>
          </v-list-item>
        </v-list-item-group>
      </v-list-group>

      <v-list-item v-else>Empty Todo List</v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { TodoListsStore } from '~/store'

export default defineComponent({
  computed: {
    todoLists() {
      return TodoListsStore.todoList
    },
    selectedTodoListIndex: {
      get() {
        return TodoListsStore.selectedTodoListIndex
      },
      set(value) {
        TodoListsStore.setSelectedTodoListIndex(value)
      },
    },
  },
})
</script>
