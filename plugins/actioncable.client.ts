import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import actioncable from 'actioncable'
import { AllSvgType } from 'interface'
import { SvgsStore, TodoListsStore } from '~/store'
import { ToggleStatusParams } from '~/store/modules/todoLists'
import { SvgParams } from '~/store/modules/svgs'
import { SendCurrentPositionParams } from '~/utils/ui/google-map-marker'
import { getOtherMenberPosition } from '~/utils/ui/google-map-other-marker'

export interface PlanChannel {
  toggleTodoStatus: ({ id, status }: ToggleStatusParams) => void
  beginPlan: () => void
  endPlan: () => void
  sendActiveSvg: (svg: SvgParams) => void
  sendCurrentPosition: ({ userId, lat, lng }: SendCurrentPositionParams) => void
}

interface ReceivedParams {
  action: keyof PlanChannel
  id?: number
  status?: 'doing' | 'done'
  svg?: AllSvgType
  userId?: number
  lat?: number
  lng?: number
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

          switch (data.action) {
            case 'beginPlan':
              TodoListsStore.doingTodos()
              break
            case 'endPlan':
              TodoListsStore.resetTodos()
              break
            case 'toggleTodoStatus':
              TodoListsStore.toggleTodoStatusMutation({ id: data.id!, status: data.status! })
              break
            case 'sendActiveSvg':
              SvgsStore.addSvgMutation(data.svg!)
              break
            case 'sendCurrentPosition':
              getOtherMenberPosition({ userId: data.userId!, lat: data.lat!, lng: data.lng! })
              break
            default:
              console.error('該当するアクションがありませんでした。', data)
          }
        },

        // --- 独自メソッド ---
        toggleTodoStatus({ id, status }: ToggleStatusParams) {
          this.perform('toggleTodoStatus', {
            id,
            status
          })
        },

        beginPlan() {
          this.perform('beginPlan', {})
        },

        endPlan() {
          this.perform('endPlan', {})
        },

        sendActiveSvg(svg: SvgParams) {
          this.perform('sendActiveSvg', { svg })
        },

        sendCurrentPosition({ userId, lat, lng }: SendCurrentPositionParams) {
          this.perform('sendCurrentPosition', { userId, lat, lng })
        }
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