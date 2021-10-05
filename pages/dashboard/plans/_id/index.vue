<template>
  <v-row justify="center">
    <template v-if="active">
      <v-col cols="12">
        <calendar></calendar>
      </v-col>

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
          <div class="text-right mr-3">
            {{ progressHash.doneTodosLength }} /
            {{ progressHash.allTodosLength }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="6" sm="2">
        <v-btn width="100%" color="secondary" @click="endPlan">計画終了</v-btn>
      </v-col>
    </template>

    <template v-else>
      <v-col cols="6" sm="2">
        <v-btn width="100%" color="secondary" @click="beginPlan"
          >計画開始</v-btn
        >
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api'
import { PlansStore, SnackbarStore, TodoListsStore } from '~/store'
import Calendar from '~/components/protected/maps/Calendar.vue'

export default defineComponent({
  components: {
    Calendar,
  },

  layout: 'protected',

  middleware: ['initialize-store'],

  setup() {
    const { $axios } = useContext()

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

    // 計画がアクティブかどうか
    const active = computed(() => {
      return PlansStore.currentPlan?.active
    })

    // 計画開始
    const beginPlan = () => {
      if (!confirm('計画を開始してもよろしいですか？')) return

      $axios
        .$patch(`/api/v1/plans/${PlansStore.currentPlan!.id}`, {
          plan: { active: true },
        })
        .then((res) => {
          PlansStore.setCurrentPlanMutation(res)
          TodoListsStore.doingTodos(true)
          SnackbarStore.visible({
            color: 'success',
            message: '計画を開始しました。頑張りましょう！',
          })
        })
        .catch(() =>
          SnackbarStore.visible({
            color: 'error',
            message: '計画の開始に失敗しました',
          })
        )
    }

    // 計画終了
    const endPlan = () => {
      if (!confirm('計画を終了してもよろしいですか？')) return

      $axios
        .$patch(`/api/v1/plans/${PlansStore.currentPlan!.id}`, {
          plan: { active: false },
        })
        .then((res) => {
          PlansStore.setCurrentPlanMutation(res)
          TodoListsStore.resetTodos(true)
          SnackbarStore.visible({
            color: 'success',
            message: '計画を終了しました。お疲れさまでした。',
          })
        })
        .catch(() =>
          SnackbarStore.visible({
            color: 'error',
            message: '計画の終了に失敗しました',
          })
        )
    }

    return {
      progressHash,
      active,
      beginPlan,
      endPlan,
    }
  },
})
</script>

<style scoped lang="sass">
.v-toolbar__title
  font-size: 1rem
</style>
