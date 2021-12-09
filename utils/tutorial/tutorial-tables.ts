import { computed, ref, watch, nextTick } from '@nuxtjs/composition-api'
import { tutorialPlanCreate } from '~/utils/tutorial/tutorial-store'

/** 全ての[data-tutorial]に指定されている値(便宜上キーと呼ぶ) */
export type DataTutorialKey =
  | 'create-plan-btn'
  | 'create-plan-input'
  | 'create-plan-check'
  | 'create-plan-submit'
  | 'plan-show-btn'
  | 'show-todo-list'
  | 'app-bar-btn'

/** 現在のシナリオの[data-tutorial]キーを格納する変数。初期値が一番最初に開始するシナリオ */
export const nowScenarioKey = ref<DataTutorialKey>('create-plan-btn')

/** ユーザーが操作可能な箇所 */
export const targetElement = ref<HTMLElement>()

/**
 * nextStepEventsの共通処理。デフォルトではtargetElement.valueにイベントリスナーを設定し、クリックしたら次のイベントに進むようにする
 * @param target デフォルトはtargetElement.value
 * @param event デフォルトは'click'イベント
 * @param func デフォルトはtrueを返す関数。trueを返す場合のみ次のイベントに進む
 * */
const nextStepAddEventListener = (opt?: {
  target?: HTMLDivElement
  event?: keyof HTMLElementEventMap
  func?: (e: Event) => boolean
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

  target.addEventListener(
    event,
    (e) => {
      if (!func(e)) return

      nowScenarioKey.value = nextKey.value!
    },
    false
  )
}

/** nextStepEventを集約する変数。イベントリスナを登録、あるいは値を監視し、条件を満たせばnowScenarioKeyに次のキーを代入する */
const nextStepEvents: { [key in DataTutorialKey]: () => void } = {
  'create-plan-btn': () => nextStepAddEventListener(),

  'create-plan-input': () =>
    nextStepAddEventListener({
      event: 'change',
      func: (e: Event) => {
        if ((e.target as HTMLInputElement).value === 'はじめての計画') return true
        return false
      },
    }),

  'create-plan-check': () =>
    nextStepAddEventListener({
      target: targetElement.value?.getElementsByClassName('v-input__slot')[0]! as HTMLDivElement,
    }),

  'create-plan-submit': () =>
    nextStepAddEventListener({
      func: () => {
        tutorialPlanCreate()
        return true
      },
    }),

  'plan-show-btn': () => {
    targetElement.value!.addEventListener(
      'click',
      async () => {
        await nextTick()
        await new Promise((resolve) => setTimeout(resolve, 300))
        const nextTarget = document.querySelectorAll('[role=tab]')[2] as HTMLDivElement
        nextTarget.dataset.tutorial = 'show-todo-list'
        nowScenarioKey.value = nextKey.value!
      },
      false
    )
  },

  'show-todo-list': () => nextStepAddEventListener(),

  "app-bar-btn": () => nextStepAddEventListener()
}

const messages: { [key in DataTutorialKey]: string[] } = {
  'create-plan-btn': ['まずは計画を作成します。'],
  'create-plan-input': [],
  'create-plan-check': [
    '公開設定は第三者が自由に計画を閲覧できるかどうかの設定です',
    'これにチェックをつけると作成者の許可なしでは計画の閲覧ができなくなります',
    'また、チェックの有無に関わらず編集作業は作成者の許可が必須になります。',
  ],
  'create-plan-submit': [],
  'plan-show-btn': ['計画が作成されました。詳細ページにアクセスしてみましょう。'],
  'show-todo-list': ['次はTodoリストを作成しましょう'],
  "app-bar-btn": []
}

/**
 * チュートリアルシナリオテーブル
 * @param dataTutorial [data-tutorial]に指定された名前
 * @param nextStepEvents 達成条件の関数。これが達成されれば次のシナリオに進む
 * @param messages モーダルに表示するメッセージの配列
 * @param tooltip 操作対象の付近に出現する吹き出し
 * 配列の順番がシナリオの順番になる
 * */
const tutorialScenarioTable: Map<
  DataTutorialKey,
  { achievementConditionsFunc: () => void; messages?: string[]; tooltip: string }
> = new Map([
  [
    'create-plan-btn',
    {
      achievementConditionsFunc: () => nextStepEvents['create-plan-btn'](),
      messages: messages['create-plan-btn'],
      tooltip: 'クリックしてください',
    },
  ],
  [
    'create-plan-input',
    {
      achievementConditionsFunc: () => nextStepEvents['create-plan-input'](),
      tooltip: '「はじめての計画」と入力してください',
    },
  ],
  [
    'create-plan-check',
    {
      achievementConditionsFunc: () => nextStepEvents['create-plan-check'](),
      messages: messages['create-plan-check'],
      tooltip: 'チェックボックスをチェックしてください',
    },
  ],
  [
    'create-plan-submit',
    {
      achievementConditionsFunc: () => nextStepEvents['create-plan-submit'](),
      tooltip: 'CREATEをクリックしてください',
    },
  ],
  [
    'plan-show-btn',
    {
      achievementConditionsFunc: () => nextStepEvents['plan-show-btn'](),
      messages: messages['plan-show-btn'],
      tooltip: '目のアイコンをクリックしてください',
    },
  ],
  [
    'show-todo-list',
    {
      achievementConditionsFunc: () => nextStepEvents['show-todo-list'](),
      messages: messages['show-todo-list'],
      tooltip: 'TODOリストをクリックしてください',
    },
  ],
  [
    'app-bar-btn',
    {
      achievementConditionsFunc: () => nextStepEvents['app-bar-btn'](),
      messages: messages['app-bar-btn'],
      tooltip: 'TODOリスト新規作成をクリックしてください',
    },
  ],
])

/** 現在のシナリオの吹き出し */
export const nowTooltip = computed(() => {
  return tutorialScenarioTable.get(nowScenarioKey.value)?.tooltip
})

/** 現在のシナリオのメッセージ群 */
export const nowMessages = computed(() => {
  return tutorialScenarioTable.get(nowScenarioKey.value)?.messages || []
})

/** 次のシナリオキー */
const nextKey = computed(() => {
  let isNowScenarioKey = false
  for (const key of tutorialScenarioTable.keys()) {
    if (isNowScenarioKey) return key

    if (key === nowScenarioKey.value) isNowScenarioKey = true
  }
})

/**
 * 現在のシナリオキーが切り替わるたびtargetElementを更新し、achievementConditionsFuncも実行してイベント登録をする
 * チュートリアル関連のwatchの中でこれが一番最初に起動する
 * */
watch(
  nowScenarioKey,
  async () => {
    // シナリオキーが更新され、メッセージが存在するならメッセージ表示済みフラグをfalseにする
    if (nowMessages.value.length) {
      ;(await import('~/utils/tutorial/tutorial')).isFinishedDisplayMsg.value = false
    }

    // ツールチップのみ先に出現することを防ぐため、ツールチップが存在していれば一旦隠す
    const tutorialTooltip = document.getElementById('tutorial-tooltip')
    if (tutorialTooltip) tutorialTooltip.style.visibility = 'hidden'

    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 300))

    targetElement.value = document.querySelector(`[data-tutorial=${nowScenarioKey.value}]`) as HTMLElement

    tutorialScenarioTable.get(nowScenarioKey.value)?.achievementConditionsFunc()
  },
  { immediate: true }
)
