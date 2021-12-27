import { defineNuxtPlugin, nextTick, ref, Ref, ComputedRef } from '@nuxtjs/composition-api'
import { DataTutorialKey } from 'interface'
import {
  isFinishedDisplayMsg,
  nowMessages,
  nowScenarioKey,
  nowTooltip,
  targetElement,
  tutorialWatchStart
} from '~/utils/tutorial/tutorial'
import { analytics } from '~/plugins/firebase'
import { logEvent } from 'firebase/analytics'

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

    // リロードしようとしたときに警告を出す
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault()

      e.returnValue = ''
    })

    if(analytics) logEvent(analytics , 'tutorial_begin')
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
