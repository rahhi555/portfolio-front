<template>
  <v-card class="mx-auto" max-width="300" tile color="primary">
    <v-card-title class="edit-sidebar-title">
      <span v-if="todoLists.length">図形にドラッグ＆ドロップ</span>
      <span v-else>Todoリストがありません</span>
    </v-card-title>

    <v-expansion-panels v-model="selectedTodoListIndex">
      <v-expansion-panel v-for="(todoList, i) in todoLists" :key="i">
        <v-expansion-panel-header
          :id="`todo-list-id-${todoList.id}`"
          class="edit-sidebar-body"
          style="padding: 0 10px;"
          expand-icon="mdi-drag"
          draggable="true"
          @dragstart="attachTodoListStart"
          @dragend="attachTodoListEnd"
          >
          <span>
            <span class="font-weight-medium mr-4">{{ todoList.title }}</span>
            <span class="text-caption">{{ todoList.todos.length }}todo</span>
          </span>
          </v-expansion-panel-header
        >
        <v-expansion-panel-content v-for="(todo, i) in todoList.todos" :key="i">
          <span style="font-size: 12px; font-weight: 400;">{{ todo.title }}</span>
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

<style scoped lang="sass">
.edit-sidebar-title
  padding: 5px 10px
  color: white
  font-weight: 600

.edit-sidebar-body
  cursor: grab
.edit-sidebar-body:active
  cursor: grabbing

</style>