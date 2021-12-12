import { computed } from '@nuxtjs/composition-api'
import { DataTutorialKey, tutorialScenarioTable } from './tutorial-table'
import {
  createPlanInTutorial,
  createTodoListInTutorial,
  createTodoInTutorial,
  createMapInTutorial,
  updatePositionInTutorial
} from '~/utils/tutorial/tutorial-table-events-store'
import { nowScenarioKey, targetElement } from '~/utils/tutorial/tutorial'

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
 * */
const nextStepAddEventListener = (opt?: {
  target?: HTMLDivElement
  event?: keyof HTMLElementEventMap
  func?: (e: HTMLInputEvent) => boolean | Promise<boolean>
}) => {
  const defaultOpt = {
    target: targetElement.value!,
    event: 'click',
    func: () => {
      return true
    },
  }
  const useOpt = { ...defaultOpt, ...opt }
  const { event, target, func } = useOpt

  // changeイベントの場合はonceオプションを付けない
  const options = event === 'change' ? false : { capture: false, once: true }

  target.addEventListener(
    event,
    async (e) => {
      if (!(await func(e as HTMLInputEvent))) return

      nowScenarioKey.value = nextKey.value!
    },
    options
  )
}

/** nextStepEventを集約する変数。イベントリスナを登録、あるいは値を監視し、条件を満たせばnowScenarioKeyに次のキーを代入する */
export const nextStepEvents: { [key in DataTutorialKey]: () => void } = {
  'create-plan-btn': () => nextStepAddEventListener(),

  'create-plan-input': () =>
    nextStepAddEventListener({
      event: 'change',
      func: ({ target }) => {
        if (target.value === 'はじめての計画') {
          target.blur()
          return true
        }
        return false
      },
    }),

  'create-plan-check': () =>
    nextStepAddEventListener({
      // チェックボックスの場合、vuetifyが生成する要素を指定しないとイベントが発火しない
      target: targetElement.value?.getElementsByClassName('v-input__slot')[0]! as HTMLDivElement,
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
      func: ({ target }) => {
        if (target.value === 'はじめてのtodoリスト') {
          target.blur()
          return true
        }
        return false
      },
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
      func: ({ target }) => {
        if (target.value === 'はじめてのtodo') {
          target.blur()
          return true
        }
        return false
      },
    }),

  'create-todo-submit': () =>
    nextStepAddEventListener({
      func: () => createTodoInTutorial()
    }),

  'show-edit-map': () => nextStepAddEventListener(),

  'create-map-app-bar-btn': () => nextStepAddEventListener(),

  'create-map-input': () =>
    nextStepAddEventListener({
      event: 'change',
      func: ({ target }) => {
        if (target.value === 'はじめてのマップ') {
          target.blur()
          return true
        }
        return false
      },
    }),

  'create-map-check': () =>
    nextStepAddEventListener({
      target: targetElement.value?.getElementsByClassName('v-input__slot')[0]! as HTMLDivElement,
    }),

  'create-map-submit': () =>
    nextStepAddEventListener({
      func: () => createMapInTutorial()
    }),

  'change-google-map-mode': () => nextStepAddEventListener(),

  "input-google-map-search": () => nextStepAddEventListener({ event: 'change' ,func: ({ target }) => {
    if(target.value === '千葉県浦安市舞浜１−１ 東京ディズニーランド') {
      target.blur()
      return true
    }
    return false
  }}),

  "set-google-map-center": () => nextStepAddEventListener({ func: () => updatePositionInTutorial() }),

  "add-rect": () => nextStepAddEventListener()
}
