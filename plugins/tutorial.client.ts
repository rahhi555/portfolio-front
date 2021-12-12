import { defineNuxtPlugin, nextTick, ref, Ref, ComputedRef } from '@nuxtjs/composition-api'
import {
  isFinishedDisplayMsg,
  nowMessages,
  nowScenarioKey,
  nowTooltip,
  targetElement,
  tutorialWatchStart
} from '~/utils/tutorial/tutorial'
import { DataTutorialKey } from '~/utils/tutorial/tutorial-table'

export default defineNuxtPlugin((_, inject) => {
  /** チュートリアルセットアップ */
  const initTutorial = async () => {
    await nextTick()
    tutorialWatchStart()

    // タブキーを無効にする
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault()
      }
    }, { passive: false })

    // スクロールを無効にする
    document.addEventListener('mousewheel', (e) => {
      e.preventDefault()
    }, { passive: false })
  }

  /** チュートリアル実行中ならtrue */
  const isRunningTutorial = ref(false)

  inject('tutorial', {
    initTutorial,
    isRunningTutorial,
    isFinishedDisplayMsg,
    nowMessages,
    nowScenarioKey,
    nowTooltip,
    targetElement,
  })
})

declare module '@nuxt/types' {
  interface Context {
    $tutorial: {
      initTutorial: () => Promise<void>
      isRunningTutorial: Ref<boolean>
      isFinishedDisplayMsg: Ref<boolean>
      nowMessages: ComputedRef<string[]>
      nowScenarioKey: Ref<DataTutorialKey>
      nowTooltip: ComputedRef<string | undefined>
      targetElement: Ref<HTMLElement | undefined>
    }
  }
}
