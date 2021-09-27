<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-expansion-panels v-model="selectedTodoListIndex">
      <v-expansion-panel v-for="(todoList, i) in todoLists" :key="i">
        <v-expansion-panel-header
          :id="`todo-list-id-${todoList.id}`"
          draggable="true"
          @dragstart="attachTodoListStart"
          @dragend="attachTodoListEnd"
          >{{ todoList.title }}</v-expansion-panel-header
        >
        <v-expansion-panel-content v-for="todo,i in todoList.todos" :key=i>
          {{todo.title}}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { TodoListsStore } from '~/store'
import TodoListAttach from '~/utils/helpers/todo-list-attach'

export default defineComponent({
  setup() {
    return {
      attachTodoListStart: () => TodoListAttach.attachTodoListStart(),
      attachTodoListEnd: (e: DragEvent) => TodoListAttach.attachTodoListEnd(e),
    }
  },

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
