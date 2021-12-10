import { defineNuxtPlugin, nextTick, ref, Ref, ComputedRef } from '@nuxtjs/composition-api'
import {
  isFinishedDisplayMsg,
  nowMessages,
  nowScenarioKey,
  nowTooltip,
  targetElement,
  DataTutorialKey,
  tutorialWatchStart
} from '~/utils/tutorial/tutorial'

export default defineNuxtPlugin((_, inject) => {
  /** チュートリアルセットアップ */
  const initTutorial = async () => {
    await nextTick()
    tutorialWatchStart()

    // タブキーおよびEscキー操作を無効にする
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault()
      }
    })
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
