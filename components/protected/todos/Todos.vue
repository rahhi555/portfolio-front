<template>
  <v-data-iterator
    :items="todos"
    item-key="id"
    style="background-color: white"
    no-data-text="　Todoがありません"
  >
    <template #header>
      <v-toolbar class="mb-2" color="primary" dark dense>
        <v-toolbar-title>{{ todoListTitle }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
          v-show="todoListTitle !== 'Not Selected'"
          icon
          @click="createDialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <todo-create-modal
          :dialog="createDialog"
          @closeDialogHandle="createDialog = false"
        ></todo-create-modal>
      </v-toolbar>
    </template>

    <template #default="{ items }">
      <v-row justify="center" justify-sm="start" class="pa-1">
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

              <v-spacer />

              <v-icon size="20" @click="deleteTodo(item)">mdi-delete</v-icon>
            </v-card-title>

            <v-divider />

            <v-list-item v-for="(value, key) in todoContents" :key="key">
              <v-list-item-content>{{ value }}:</v-list-item-content>
              <v-list-item-content class="align-end">
                {{ item[key] }}
              </v-list-item-content>
            </v-list-item>

            <v-divider class="mb-2" />

            <v-row no-gutters>
              <v-col v-for="(image, i) in item.images" :key="i" cols="3">
                <v-img
                  tile
                  :src="image"
                  height="40"
                  @click="imageShow(item.id)"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <todo-image-carousel
        :image-dialog="imageDialog"
        :images="selectImages"
        @imageClose="imageDialog = false"
      ></todo-image-carousel>
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { Todo } from 'interface'
import { TodoListsStore } from '~/store'
import TodoCreateModal from '~/components/protected/todos/TodoCreateModal.vue'
import TodoImageCarousel from '~/components/protected/todos/TodoImageCarousel.vue'

export default defineComponent({
  components: {
    TodoCreateModal,
    TodoImageCarousel,
  },

  setup() {
    const { $axios, app } = useContext()

    const todoContents = {
      body: '内容',
      beginTime: '開始時刻',
      endTime: '終了時刻',
      status: '進行状況',
    }

    const imageDialog = ref(false)
    const selectImages = ref<string[]>([])
    const imageShow = async (todoId: number) => {
      app.loading = true
      selectImages.value = await $axios.$get(
        `/api/v1/todos/${todoId}?column=images`
      )
      app.loading = false
      imageDialog.value = true
    }

    const createDialog = ref(false)

    const deleteTodo = (todo: Todo) => {
      TodoListsStore.deleteTodo(todo)
    }

    return {
      todoContents,
      imageDialog,
      selectImages,
      imageShow,
      deleteTodo,
      createDialog
    }
  },

  computed: {
    todoListTitle() {
      let title = 'Not Selected'
      const index = TodoListsStore.selectedTodoListIndex
      if (Number.isInteger(index)) {
        // @ts-ignore
        title = TodoListsStore.todoList[index].title
      }
      return title
    },
    todos() {
      return TodoListsStore.selectedTodos
    },
  },
})
</script>
