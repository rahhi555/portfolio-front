import { defineNuxtPlugin, ref, computed } from '@nuxtjs/composition-api'
import actioncable from 'actioncable'
import { AllSvgType, TodoStatus } from 'interface'
import { PlansStore, SvgsStore, TodoStatusesStore, SnackbarStore, MapsStore } from '~/store'
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

type PlanChannelPeformMethodsPayload = ChangeStatusParams | SvgParams | SendCurrentPositionParams

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

export default defineNuxtPlugin(({ app, $config, route, $tutorial }, inject) => {
  const cable = ref<actioncable.Cable>()
  
  // チャンネル作成
  const createSubscription = (planId: string) => {
    cable.value = actioncable.createConsumer($config.actioncable)
    
    cable.value.subscriptions.create(
      { channel: 'PlanChannel', plan_id: Number.parseInt(planId) },
      {
        // --- アクションケーブル固有メソッド ---
        connected() {
          console.log('connected')
        },

        disconnected() {
          console.log('disconnected')
        },

        rejected() {
          SnackbarStore.visible({ color: 'error', message: '処理に失敗しました。リロードをお試しください。'  })
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
          if(!MapsStore.maps.length) {
            SnackbarStore.visible({ color: 'warning', message: 'マップが存在しない状態で計画を開始することはできません' })
            return
          }

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
    // チュートリアル中ならリターン
    if(process.client && $tutorial.isRunningTutorial.value) return

    // ページ遷移先が同じ計画の場合、チャンネルを作成しない
    if (from.params.id === to.params.id) return

    // ページ遷移前が計画ページかつ遷移後が計画ページじゃない場合、現在のplanChannelを破棄する
    if (from.params.id && !to.params.id) {
      cable.value?.disconnect()
      return
    }
    cable.value = undefined
    createSubscription(to.params.id)
  })

  // 名前が長いため用意した省略用変数
  const subscription = computed(() => {
    return cable.value?.subscriptions.subscriptions[0]
  })
  
  const planChannelPeformMethods = async (callMethod: keyof PlanChannel, payload?: PlanChannelPeformMethodsPayload) => {
    if(!subscription.value && !$tutorial.isRunningTutorial.value) {
      SnackbarStore.visible({ color: 'warning', message: '通信を再接続します。少々お待ち下さい...' })
      cable.value = undefined
      createSubscription(route.params.id)
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    if(!subscription.value && !$tutorial.isRunningTutorial.value) {
      SnackbarStore.visible({ color: 'error', message: '通信の接続に失敗しました。リロードをお試しください。' })
      return
    }

    switch(callMethod) {
      case 'activatePlan':
        subscription.value!.activatePlan()
        break;
      case 'inactivatePlan':
        cable.value?.subscriptions.subscriptions[0].inactivatePlan()
        break;
      case 'changeTodoStatus':
        if('status' in payload!) {
          cable.value?.subscriptions.subscriptions[0].changeTodoStatus(payload)
        }
        break;
      case 'sendActiveSvg':
        if('type' in payload!) {
          cable.value?.subscriptions.subscriptions[0].sendActiveSvg(payload)
        }
        break;
      case 'sendCurrentPosition':
        if('lat' in payload!) {
          cable.value?.subscriptions.subscriptions[0].sendCurrentPosition(payload)
        }
    }
  }

  inject('planChannelPeformMethods', planChannelPeformMethods)
})

declare module '@nuxt/types' {
  interface Context {
    $planChannelPeformMethods: (callMethod: keyof PlanChannel, payload?: PlanChannelPeformMethodsPayload) => Promise<void>
  }
}