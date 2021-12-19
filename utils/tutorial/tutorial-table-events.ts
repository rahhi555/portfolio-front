import { computed, watch } from '@nuxtjs/composition-api'
import { DataTutorialKey, tutorialScenarioTable } from './tutorial-table'
import {
  MAIN_BIG_NUMBER,
  createPlanInTutorial,
  createTodoListInTutorial,
  createTodoInTutorial,
  createMapInTutorial,
  updatePositionInTutorial,
  addRectInTutorial,
  attachTodoListInTutorial,
  removeTargetArea,
  addMemberInTutorial,
  acceptMemberInTutorial,
  activatePlanInTutorial,
  chackMainTodoInTutorial,
  chackAnotherTodoInTutorial,
  inactivatePlanInTutorial,
} from '~/utils/tutorial/tutorial-table-events-store'
import { nowScenarioKey, targetElement, isFinishedDisplayMsg, sleep } from '~/utils/tutorial/tutorial'

/** 次のシナリオキー */
const nextKey = computed(() => {
  let isNowScenarioKey = false
  for (const key of tutorialScenarioTable.keys()) {
    if (isNowScenarioKey) return key

    if (key === nowScenarioKey.value) isNowScenarioKey = true
  }
})

/** EventタイプのtargetをHTMLInputElementに上書き */
interface HTMLInputEvent extends Event {
  target: HTMLInputElement
}

/**
 * nextStepEventsの共通処理。デフォルトではtargetElement.valueにイベントリスナーを設定し、クリックしたら次のイベントに進むようにする
 * @param target デフォルトはtargetElement.value
 * @param event デフォルトは'click'イベント
 * @param func デフォルトはtrueを返す関数。trueを返す場合のみ次のイベントに進む
 * @param once デフォルトはtrue。addEventLitenerのオプションでtrueにすると一度発火したら自動でremoveされる。
 * */
const nextStepAddEventListener = (opt?: {
  target?: HTMLElement
  event?: keyof HTMLElementEventMap
  func?: (e: HTMLInputEvent) => boolean | Promise<boolean>
  once?: boolean
}) => {
  const defaultOpt = {
    target: targetElement.value!,
    event: 'click',
    func: () => {
      return true
    },
    once: true,
  }
  const useOpt = { ...defaultOpt, ...opt }
  const { event, target, func, once } = useOpt

  target.addEventListener(
    event,
    async (e) => {
      if (!(await func(e as HTMLInputEvent))) return

      nowScenarioKey.value = nextKey.value!
    },
    { capture: false, once, passive: true }
  )
}

/**
 * changeイベントの共通処理。フォームの値が検証値と同じならtrue,そうでなければfalseを返す。
 * 入力後の値の操作を防ぐためtrueを返す前にblurでフォーカスを外す。
 * safariのみblurを入れると二重にイベントが発火してバグるので、対策として300ms遅延させている
 * @param e 入力イベント
 * @param value 検証値
 * */
const formWithArgumentMatches = async (e: HTMLInputEvent, value: string | number) => {
  if (e.target.value === value) {
    await sleep(300)
    e.target.blur()
    return true
  }
  return false
}

/** nextStepEventを集約する変数。イベントリスナを登録、あるいは値を監視し、条件を満たせばnowScenarioKeyに次のキーを代入する */
export const nextStepEvents: { [key in DataTutorialKey]: () => void } = {
  'create-plan-btn': () => nextStepAddEventListener(),

  'create-plan-input': () =>
    nextStepAddEventListener({
      event: 'change',
      func: async (e) => {
        return await formWithArgumentMatches(e, '日比谷公園ボランティア')
      },
      once: false,
    }),

  'create-plan-check': () =>
    nextStepAddEventListener({
      // チェックボックスの場合、vuetifyが生成する要素を指定しないとイベントが発火しない
      target: targetElement.value?.getElementsByClassName('v-input__slot')[0]! as HTMLElement,
    }),

  'create-plan-submit': () =>
    nextStepAddEventListener({
      func: () => createPlanInTutorial(),
    }),

  'plan-show-btn': () => {
    nextStepAddEventListener()
  },

  'show-todo-list': () => nextStepAddEventListener(),

  'create-todo-list-app-bar-btn': () => nextStepAddEventListener(),

  'create-todo-list-input': () =>
    nextStepAddEventListener({
      event: 'change',
      func: async (e) => {
        return await formWithArgumentMatches(e, 'レストラン周辺')
      },
      once: false,
    }),

  'create-todo-list-submit': () =>
    nextStepAddEventListener({
      func: () => createTodoListInTutorial(),
    }),

  'select-todo-list': () => nextStepAddEventListener(),

  'create-todo-btn': () => nextStepAddEventListener(),

  'create-todo-input': () =>
    nextStepAddEventListener({
      event: 'change',
      func: async (e) => {
        return await formWithArgumentMatches(e, 'ゴミ拾い')
      },
      once: false,
    }),

  'create-todo-submit': () =>
    nextStepAddEventListener({
      func: () => createTodoInTutorial(),
    }),

  'show-edit-map': () => nextStepAddEventListener(),

  'create-map-app-bar-btn': () => nextStepAddEventListener(),

  'create-map-input': () =>
    nextStepAddEventListener({
      event: 'change',
      func: async (e) => {
        return await formWithArgumentMatches(e, '日比谷公園')
      },
      once: false,
    }),

  'create-map-check': () =>
    nextStepAddEventListener({
      target: targetElement.value?.getElementsByClassName('v-input__slot')[0]! as HTMLElement,
    }),

  'create-map-submit': () =>
    nextStepAddEventListener({
      func: () => createMapInTutorial(),
    }),

  'change-google-map-mode': () =>
    nextStepAddEventListener({
      target: targetElement.value?.getElementsByClassName('v-input__slot')[0]! as HTMLElement,
    }),

  'input-google-map-search': () =>
    nextStepAddEventListener({
      event: 'keydown',
      func: async (e) => {
        // safariがchangeイベントを発火しないためやむなくkeydownイベントにする
        // @ts-ignore
        if (e.code === 'Enter') {
          return await formWithArgumentMatches(e, '東京都千代田区日比谷公園１ 日比谷公園')
        } else {
          return false
        }
      },
      once: false,
    }),

  'set-google-map-center': () => nextStepAddEventListener({ func: () => updatePositionInTutorial() }),

  'add-rect': () => nextStepAddEventListener({ func: () => addRectInTutorial() }),

  'drag-and-save-rect': () =>
    nextStepAddEventListener({
      event: 'mouseup',
      func: () => {
        if (nowScenarioKey.value !== 'drag-and-save-rect') return false

        const targetRect = document.getElementById(`svg-${MAIN_BIG_NUMBER}`)!
        const transformStr = targetRect.getAttribute('transform')!

        const transformXYArray = transformStr.match(/\d+/g)!
        const x = Number.parseInt(transformXYArray[0])
        const y = Number.parseInt(transformXYArray[1])
        if (x < 260 || 1000 < x || y < 100 || 500 < y) {
          alert(`図形が赤枠内にありません ${x} ${y}`)
          return false
        }
        removeTargetArea()
        return true
      },
      once: false,
    }),

  'attach-todo-list': () =>
    nextStepAddEventListener({
      target: document.getElementById(`todo-list-id-${MAIN_BIG_NUMBER}`)!,
      event: 'dragend',
      func: () => {
        return attachTodoListInTutorial()
      },
      once: false,
    }),

  'add-member': () => {
    const stop = watch(isFinishedDisplayMsg, async () => {
      addMemberInTutorial()
      await sleep(1000)
      stop()
      nowScenarioKey.value = nextKey.value!
    })
  },

  'show-member': () => {
    nextStepAddEventListener()
  },

  'accept-member': () => nextStepAddEventListener({ func: () => acceptMemberInTutorial() }),

  'show-home': () => nextStepAddEventListener(),

  'activate-plan': () => nextStepAddEventListener({ func: () => activatePlanInTutorial() }),

  'show-map': () => nextStepAddEventListener(),

  'click-rect': () => nextStepAddEventListener({ target: document.getElementById(`svg-${MAIN_BIG_NUMBER}`)! }),

  'check-todo-0': () =>
    nextStepAddEventListener({
      target: targetElement.value!.querySelector('button')!,
      func: () => chackMainTodoInTutorial(),
    }),

  'check-todo-1': () => {
    const stop = watch(isFinishedDisplayMsg, async () => {
      await sleep(300)
      chackAnotherTodoInTutorial()
      await sleep(1000)
      stop()
      nowScenarioKey.value = nextKey.value!
    })
  },

  'show-home-second': () => nextStepAddEventListener(),

  'progress-bar': () => {
    const stop = watch(isFinishedDisplayMsg, async () => {
      await sleep(1000)
      stop()
      nowScenarioKey.value = nextKey.value!
    })
  },

  'inactivate-plan': () => nextStepAddEventListener({ func: () => inactivatePlanInTutorial() }),

  'finish-tutorial': () =>
    nextStepAddEventListener({
      func: async () => {
        await window.$nuxt.$router.replace('/dashboard/plans')
        window.$nuxt.$router.go(0)
        return true
      },
    }),
}
