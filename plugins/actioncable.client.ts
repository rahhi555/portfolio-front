import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import actioncable from 'actioncable'
import { AllSvgType, TodoStatus } from 'interface'
import { PlansStore, SvgsStore, TodoStatusesStore } from '~/store'
import { ChangeStatusParams } from '~/store/modules/todoStatuses'
import { SvgParams } from '~/store/modules/svgs'
import { SendCurrentPositionParams } from '~/utils/ui/google-map-marker'
import { getOtherMenberPosition } from '~/utils/ui/google-map-other-marker'


export interface PlanChannel {
  changeTodoStatus: ({ id, status }: ChangeStatusParams) => void
  activatePlan: () => void
  inactivatePlan: () => void
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
  name?: string
  todoStatuses?: TodoStatus[]
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
    
    cable.subscriptions.create(
      { channel: 'PlanChannel', plan_id: Number.parseInt(planId) },
      {
        // --- アクションケーブル固有メソッド ---
        connected() {
        },

        disconnected() {
        },

        rejected() {
        },

        received(data: ReceivedParams) {
          switch (data.action) {
            case 'activatePlan':
              PlansStore.activatePlan()
              TodoStatusesStore.initTodoStatuses(data.todoStatuses!)
              break
            case 'inactivatePlan':
              PlansStore.inactivatePlan()
              TodoStatusesStore.clearTodoStatuses()
              break
            case 'changeTodoStatus':
              TodoStatusesStore.changeTodoStatus({ id: data.id!, status: data.status! })
              break
            case 'sendActiveSvg':
              SvgsStore.addSvgMutation(data.svg!)
              break
            case 'sendCurrentPosition':
              getOtherMenberPosition({ userId: data.userId!, lat: data.lat!, lng: data.lng!, name: data.name! })
              break
            default:
              console.error('該当するアクションがありませんでした。', data)
          }
        },

        // --- 独自メソッド ---
        changeTodoStatus({ id, status }: ChangeStatusParams) {
          this.perform('changeTodoStatus', {
            id,
            status
          })
        },

        activatePlan() {
          if (!confirm('計画を開始してもよろしいですか？')) return
          this.perform('activatePlan', {})
        },

        inactivatePlan() {
          if (!confirm('計画を終了してもよろしいですか？')) return
          this.perform('inactivatePlan', {})
        },

        sendActiveSvg(svg: SvgParams) {
          this.perform('sendActiveSvg', { svg })
        },

        sendCurrentPosition({ userId, lat, lng, name }: SendCurrentPositionParams) {
          this.perform('sendCurrentPosition', { userId, lat, lng, name })
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
      // cable.subscriptions.subscriptions.forEach((planChannel) => {
      //   cable.subscriptions.remove(planChannel)
      // })
      cable.disconnect()
      return
    }

    createSubscription(to.params.id)
  })
  
  inject('planChannel', cable.subscriptions.subscriptions)
})

declare module '@nuxt/types' {
  interface Context {
  /** $planChannel[0]が現在のチャンネル。チャンネルを直接変数に代入しようとするとundefinedになるので、配列ごと代入している。  
   * [0]以外の用途はなく、代入されることも無いはず
   */
    $planChannel: PlanChannel[]
  }
}