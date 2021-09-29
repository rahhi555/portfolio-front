<template>
  <text :x="rect.width / 2" :y="rect.height / 1.5" text-anchor="middle">
    {{ rectText }}
  </text>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { TodoListsStore } from '~/store'

export default defineComponent({
  props: {
    rect: {
      type: Object,
      default: null
    }
  },

  computed: {
    rectText() {
      const rect = this.rect as Rect 
      const todoList = TodoListsStore.todoList.find(todoList => todoList.id === rect.todoListId)
      return todoList?.title
    }
  }
})
</script>