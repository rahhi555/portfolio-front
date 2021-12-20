<template>
  <v-flex class="d-inline-flex justify-space-between data-todo-list-item">
    <v-text-field
      v-if="isEdit"
      ref="inputForm"
      :error-messages="errorMessage"
      dense
      class="text-body2"
      hint='Enterで更新'
      :value="todoList.title"
      @keydown.enter="updateTodoList($event.target.value, todoList.id)"
      @blur="isEdit = false"
    />
    <v-list-item-title v-else data-tutorial="select-todo-list">
      {{ todoList.title }}
    </v-list-item-title>
    <v-list-item-icon v-if="!isEdit">
      <v-icon size="20" @click="visibleInputForm"
        >mdi-square-edit-outline</v-icon
      >
      <v-icon size="20" @click="deleteTodoList">mdi-delete</v-icon>
    </v-list-item-icon>
    <v-list-item-icon v-else>
      <v-icon size="20"
        >mdi-undo-variant</v-icon
      >
    </v-list-item-icon>
  </v-flex>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from '@nuxtjs/composition-api'
import { TodoListsStore } from '~/store'

export default defineComponent({
  props: {
    todoList: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const isEdit = ref(false)
    const inputForm = ref<HTMLInputElement>()
    const visibleInputForm = () => {
      isEdit.value = true
      // v-ifで表示を切り替え前にフォーカスすると失敗する
      nextTick(() => {
        inputForm.value?.focus()
      })
    }

    const deleteTodoList = async () => {
      if(!confirm('Todoリストを削除してもよろしいですか？')) return
      await TodoListsStore.deleteTodoList(props.todoList.id)
    }

    const errorMessage = ref<null | string>(null)
    const updateTodoList = (title: string, id: number) => {
      if(title === props.todoList.title) {
        errorMessage.value = '値が変更されていません'
        setTimeout(() => {
          errorMessage.value = null
        }, 2000)
        return
      }
      TodoListsStore.updateTodoList({ title, id })
      isEdit.value = false
    }

    return {
      isEdit,
      inputForm,
      errorMessage,
      visibleInputForm,
      deleteTodoList,
      updateTodoList,
    }
  },
})
</script>
