<template>
  <v-row justify="center">
    <v-col cols="12" sm="8">
      <v-card>
        <v-toolbar class="mb-2" color="primary" dark height="30">
          <v-toolbar-title>進行状況</v-toolbar-title>
        </v-toolbar>
      
        <v-progress-linear
          color="light-blue"
          height="20"
          :value="progressHash.progressPercentage"
          striped
        ></v-progress-linear>
        <v-card-text class="text-right pa-1">
          {{ progressHash.doneTodosLength }} / {{ progressHash.allTodosLength }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { TodoListsStore } from '~/store'

export default defineComponent({
  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    const progressHash = computed(() => {
      const todos = TodoListsStore.todoList.map((todoList) => todoList.todos)

      // todoの総数
      const allTodosLength = todos.reduce((prev, current) => {
        return prev + current!.length
      }, 0)

      // ステータスがdoneであるtodoの総数
      const doneTodosLength = todos.reduce((prev, current) => {
        return (
          prev +
          current!.reduce((prev, current) => {
            if (current.status === 'done') return prev + 1
            return prev
          }, 0)
        )
      }, 0)

      // 進行状況を百分率で算出
      const progressPercentage = Math.ceil(
        (doneTodosLength / allTodosLength) * 100
      )

      const progressHash = {
        allTodosLength,
        doneTodosLength,
        progressPercentage,
      }

      return progressHash
    })

    return {
      progressHash,
    }
  },
})
</script>

<style scoped lang="sass">
.v-toolbar__title
  font-size: 1rem
.theme--light.v-card > .v-card__text
  color: #333
</style>