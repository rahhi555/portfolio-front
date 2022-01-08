/**
 * @fileoverview チュートリアルファイルを集約し、プラグインのエンドポイントとなるファイル。また、チュートリアルに必要なwatchメソッドを定義している。
 */

import { DataTutorialKey } from 'interface'
import { computed, ref, watch, nextTick } from '@nuxtjs/composition-api'
import { tutorialTooltip } from '~/utils/tutorial/tutorial-tooltip'
import { nextStepEvents } from '~/utils/tutorial/tutorial-events'
import { messages } from '~/utils/tutorial/tutorial-messages'

/** チュートリアルで最前面に表示されるDiv要素。全画面を覆いつつclipPathスタイルを指定して切り抜くことで、特定箇所のみユーザー操作を許可する。 */
export const overlayLayer = ref<HTMLDivElement>()

/** 黒枠と黒背景のレイヤー */
export const helperLayer = ref<HTMLDivElement>()

/** レイヤーの初期化 */
export const initLayers = () => {
  overlayLayer.value = document.getElementById('overlay-layer') as HTMLDivElement
  helperLayer.value = document.getElementById('helper-layer') as HTMLDivElement
}

/** 現在のシナリオの[data-tutorial]キーを格納する変数。初期値が一番最初に開始するシナリオ */
export const nowScenarioKey = ref<DataTutorialKey>('create-plan-btn')

/** ユーザーが操作可能な箇所 */
export const targetElement = ref<HTMLElement>()

/** 現在のメッセージが表示し終えたか */
export const isFinishedDisplayMsg = ref(false)

/** 現在のシナリオの吹き出し */
export const nowTooltip = computed(() => {
  return tutorialTooltip[nowScenarioKey.value]
})

/** 現在のシナリオのメッセージ群 */
export const nowMessages = computed(() => {
  return messages[nowScenarioKey.value] || []
})

/** スリープ関数 */
export const sleep = (timer: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, timer))
}

/** チュートリアルに必要なwatchを開始する(直にwatchを書くとインポートした時点で監視が始まるため、チュートリアル開始時にメソッドとして呼び出す) */
export const tutorialWatchStart = () => {
  /**
   * 現在のシナリオキーが切り替わるたびtargetElementを取得しイベント登録をする
   * チュートリアル関連のwatchの中でこれが一番最初に起動する
   * */
  watch(
    nowScenarioKey,
    async () => {
      // シナリオキーが更新され、メッセージが存在するならメッセージ表示済みフラグをfalseにする
      if (nowMessages.value.length) {
        isFinishedDisplayMsg.value = false
      }

      await nextTick()
      await sleep(300)

      const targets = document.querySelectorAll('[data-tutorial]')
      // @ts-ignore
      for (const target of targets) {
        const dataTutorial = target.dataset.tutorial as string
        if (dataTutorial.includes(nowScenarioKey.value)) {
          targetElement.value = target
          break
        }
      }

      if (!nowScenarioKey.value) return
      nextStepEvents[nowScenarioKey.value]()
    },
    { immediate: true }
  )

  /** メッセージが表示し終えるたび選択箇所に沿って中抜きする */
  watch(
    () => [isFinishedDisplayMsg.value, targetElement.value],
    async () => {
      await nextTick()
      // DOMが中途半端に更新された状態で取得され、更にその後watchが発火しないため、遅延させ最終的なDOMを取得する
      await sleep(300)

      // メッセージが表示し終えていなければリターン
      if (!isFinishedDisplayMsg.value || !targetElement.value) return

      // レイヤーが無ければリターン
      if (!overlayLayer.value || !helperLayer.value) return

      // ヘルパーレイヤーの無効化解除
      helperLayer.value?.classList.remove('helper-layer-inactive')

      // 選択箇所の位置情報取得
      const targetRect = targetElement.value.getBoundingClientRect()

      // 選択箇所の位置をPath文字列に変換
      const { top, left, width, height } = targetRect
      const targetRectPath = `M ${left} ${top}  h ${width} v ${height} h -${width} z`

      // 画面全体の位置をPath文字列に変換
      const { clientWidth, clientHeight } = overlayLayer.value
      const displayScreenPath = `M 0 0 v ${clientHeight} h ${clientWidth} v -${clientHeight} z`

      // 選択箇所に沿って中抜き
      overlayLayer.value.style.clipPath = `path('${targetRectPath} ${displayScreenPath}')`

      // 黒枠と黒背景設定
      helperLayer.value.style.top = `${top - 5}px`
      helperLayer.value.style.left = `${left - 5}px`
      helperLayer.value.style.height = `${height + 10}px`
      helperLayer.value.style.width = `${width + 10}px`
    },
    { immediate: true }
  )
}
