import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import actioncable from 'actioncable'
import { TodoListsStore } from '~/store'
import { ToggleStatusParams } from '~/store/modules/todoLists'

interface ReceivedParams {
  trigger: 'beginPlan' | 'endPlan' | 'toggleTodoStatus'
  id?: number
  status?: 'doing' | 'done'
}

export interface PlanChannel {
  toggleTodoStatus: ({ id, status }: ToggleStatusParams) => void
  beginPlan: () => void
  endPlan: () => void
}

declare module 'actioncable' {
  interface Subscriptions {
    subscriptions: PlanChannel[]
    remove: (planChannel: PlanChannel) => void
  }
}

export default defineNuxtPlugin(({ app, $config }, inject) => {
  const cable = actioncable.createConsumer($config.actioncable)

  // チャンネル作成
  const createSubscription = (planId: string) => {
    console.log('planId', planId)
    
    cable.subscriptions.create(
      { channel: 'PlanChannel', plan_id: Number.parseInt(planId) },
      {
        // --- アクションケーブル固有メソッド ---
        connected() {
          console.log('actioncable connected')
        },

        disconnected() {
          console.log('actincable disconnected')
        },

        rejected() {
          console.log('actincable rejected')
        },

        received(data: ReceivedParams) {
          console.log(data)

          switch (data.trigger) {
            case 'beginPlan':
              TodoListsStore.doingTodos()
              break
            case 'endPlan':
              TodoListsStore.resetTodos()
              break
            case 'toggleTodoStatus':
              TodoListsStore.toggleTodoStatusMutation({ id: data.id!, status: data.status! })
              break
          }
          
        },

        // --- 独自メソッド ---
        toggleTodoStatus({ id, status }: ToggleStatusParams) {
          this.perform('toggle_todo_status', {
            id,
            status
          })
        },

        beginPlan() {
          this.perform('begin_plan', {})
        },

        endPlan() {
          this.perform('end_plan', {})
        },
      }
    )
  }

  // ページ遷移のチャンネル作成及び破棄
  app.router?.afterEach((to, from) => {
    // ページ遷移先が同じ計画の場合、チャンネルを作成しない
    if (from.params.id === to.params.id) return

    // ページ遷移前が計画ページかつ遷移後が計画ページじゃない場合、現在のplanChannelを破棄する
    if (from.params.id && !to.params.id) {
      cable.subscriptions.subscriptions.forEach((planChannel) => {
        cable.subscriptions.remove(planChannel)
      })
      return
    }

    createSubscription(to.params.id)

    console.log('planChannel', cable.subscriptions.subscriptions)
  })
  
  inject('planChannel', cable.subscriptions.subscriptions)
})

declare module '@nuxt/types' {
  interface Context {
    $planChannel: PlanChannel[]
  }
}