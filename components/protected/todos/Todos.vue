<template>
  <v-data-iterator :items="todos" item-key="id">
    <template #header>
      <v-toolbar class="mb-2" color="indigo darken-5" dark flat>
        <v-toolbar-title>{{ todoListTitle }}</v-toolbar-title>
      </v-toolbar>
    </template>

    <template #default="{ items }">
      <v-row>
        <v-col
          v-for="item in items"
          :key="item.name"
          cols="9"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-card-title>
              <h4>{{ item.title }}</h4>
            </v-card-title>

            <v-divider />

            <v-list-item>
              <v-list-item-content>Title:</v-list-item-content>
              <v-list-item-content class="align-end">
                {{ item.title }}
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { TodoListsStore } from '~/store'

export default defineComponent({
  setup() {
    return {
      todos: [
        { id: 1, title: 'test1' },
        { id: 2, title: 'test2' },
        { id: 3, title: 'test3' },
      ],
    }
  },

  computed: {
    todoListTitle() {
      let title = 'Not Selected'
      const index = TodoListsStore.selectedTodoList
      if(Number.isInteger(index)) {
        // @ts-ignore
        title = TodoListsStore.todoList[index].title
      }
      return title
    }
  }
})
</script>
