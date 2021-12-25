<template>
  <v-row justify="center">
    <template v-if="active">
      <v-col cols="12">
        <MapsCalendar :todos="progressHash.todos" />
      </v-col>

      <v-col cols="12" sm="8" data-tutorial="progress-bar">
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
          <div class="text-right mr-3">
            {{ progressHash.doneTodosLength }} /
            {{ progressHash.allTodosLength }}
          </div>
        </v-card>
      </v-col>

      <v-col v-if="accept" cols="6" sm="2">
        <v-btn data-tutorial="inactivate-plan" width="100%" color="secondary" @click="inactivatePlan">計画終了</v-btn>
      </v-col>
    </template>

    <template v-else>
      <v-col cols="12" md="9">
        <MapsHomeOverView />
      </v-col>

      <v-col v-show="$vuetify.breakpoint.smAndUp" cols="12" />

      <v-col v-if="accept" data-tutorial="activate-plan" cols="6" sm="2">
        <v-btn width="100%" color="secondary" @click="activatePlan">計画開始</v-btn>
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
export default {
  layout: 'protected',

  middleware: ['initialize-store'],

  head: {
    title: 'Plan'
  }
}
</script>

<script setup lang="ts">
import { PlansStore, TodoListsStore, MembersStore, TodoStatusesStore } from '~/store'

const { $planChannelPeformMethods, $tutorial } = useContext()

const progressHash = computed(() => {
  const todos = TodoListsStore.todoLists.flatMap((todoList) => todoList.todos)

  // todoの総数
  const allTodosLength = TodoStatusesStore.getAllTodoStatuses.length

  // ステータスがdoneであるtodoの総数
  const doneTodosLength = TodoStatusesStore.getAllTodoStatuses.filter((todoStatus) => {
    return todoStatus.status === 'done'
  }).length

  // 進行状況を百分率で算出
  const progressPercentage = Math.ceil((doneTodosLength / allTodosLength) * 100)

  const progressHash = {
    todos,
    allTodosLength,
    doneTodosLength,
    progressPercentage,
  }

  return progressHash
})

// 計画がアクティブかどうか
const active = computed(() => {
  return PlansStore.currentPlan?.active
})

const activatePlan = () => {
  if ($tutorial.isRunningTutorial.value) return

  $planChannelPeformMethods('activatePlan')
}

const inactivatePlan = () => {
  if ($tutorial.isRunningTutorial.value) return

  $planChannelPeformMethods('inactivatePlan')
}

const accept = computed(() => MembersStore.currentUserAccept)
</script>

<style scoped lang="sass">
.v-toolbar__title
  font-size: 1rem
</style>
