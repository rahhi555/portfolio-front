import { computed, ref, watch, nextTick } from '@nuxtjs/composition-api'
import { tutorialPlanCreate, tutorialTodoListCreate, tutorialTodoCreate } from '~/utils/tutorial/tutorial-store'

/** 全ての[data-tutorial]に指定されている値(便宜上キーと呼ぶ) */
export type DataTutorialKey =
  | 'create-plan-btn'
  | 'create-plan-input'
  | 'create-plan-check'
  | 'create-plan-submit'
  | 'plan-show-btn'
  | 'show-todo-list'
  | 'app-bar-btn'
  | 'create-todo-list-input'
  | 'create-todo-list-submit'
  | 'select-todo-list'
  | 'create-todo-btn'
  | 'create-todo-input'
  | 'create-todo-submit'

/** チュートリアルで最前面に表示されるDiv要素。全画面を覆いつつclipPathスタイルを指定して切り抜くことで、特定箇所のみユーザー操作を許可する。 */
const tutorialDiv = ref<HTMLDivElement>()

/** 現在のシナリオの[data-tutorial]キーを格納する変数。初期値が一番最初に開始するシナリオ */
export const nowScenarioKey = ref<DataTutorialKey>('create-plan-btn')

/** ユーザーが操作可能な箇所 */
export const targetElement = ref<HTMLElement>()

/** 現在のメッセージが表示し終えたか */
export const isFinishedDisplayMsg = ref(false)

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
  func?: (e: HTMLInputEvent) => boolean
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
      if (!func(e as HTMLInputEvent)) return

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

  'app-bar-btn': () => nextStepAddEventListener(),

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
      func: () => {
        tutorialTodoListCreate()
        return true
      },
    }),

  'select-todo-list': () => nextStepAddEventListener(),

  'create-todo-btn': () => nextStepAddEventListener(),

  'create-todo-input': () => nextStepAddEventListener({ event: 'change', func: ({ target }) => {
    if (target.value === 'はじめてのtodo') { 
      target.blur()
      return true
    }
    return false
  }}),

  "create-todo-submit": () => nextStepAddEventListener({ func: () => {
    tutorialTodoCreate()
    return true
  }})
}

const messages: { [key in DataTutorialKey]: string[] } = {
  'create-plan-btn': ['まずは計画を作成します。'],
  'create-plan-input': [],
  'create-plan-check': [
    '次に公開の有無を設定します',
    '公開設定は第三者が自由に計画を閲覧できるかどうかの設定です',
    'これにチェックをつけると作成者の許可なしでは計画の閲覧ができなくなります',
    'また、チェックの有無に関わらず編集作業は作成者の許可が必須になります。',
  ],
  'create-plan-submit': [],
  'plan-show-btn': ['計画が作成されました。詳細ページにアクセスしてみましょう。'],
  'show-todo-list': ['次はTodoリストを作成しましょう'],
  'app-bar-btn': [],
  'create-todo-list-input': [],
  'create-todo-list-submit': [],
  'select-todo-list': ['Todoリストが作成されました。次はTodoを作成しましょう'],
  'create-todo-btn': [],
  'create-todo-input': [],
  "create-todo-submit": []
}

/**
 * チュートリアルシナリオテーブル
 * @param dataTutorial [data-tutorial]に指定された名前
 * @param nextStepEvent 達成条件の関数。これが達成されれば次のシナリオに進む
 * @param messages モーダルに表示するメッセージの配列
 * @param tooltip 操作対象の付近に出現する吹き出し
 * 配列の順番がシナリオの順番になる
 * */
const tutorialScenarioTable: Map<DataTutorialKey, { nextStepEvent: () => void; messages?: string[]; tooltip: string }> =
  new Map([
    [
      'create-plan-btn',
      {
        nextStepEvent: () => nextStepEvents['create-plan-btn'](),
        messages: messages['create-plan-btn'],
        tooltip: 'クリックしてください',
      },
    ],
    [
      'create-plan-input',
      {
        nextStepEvent: () => nextStepEvents['create-plan-input'](),
        tooltip: '「はじめての計画」と入力してください',
      },
    ],
    [
      'create-plan-check',
      {
        nextStepEvent: () => nextStepEvents['create-plan-check'](),
        messages: messages['create-plan-check'],
        tooltip: 'チェックボックスをチェックしてください',
      },
    ],
    [
      'create-plan-submit',
      {
        nextStepEvent: () => nextStepEvents['create-plan-submit'](),
        tooltip: 'CREATEをクリックしてください',
      },
    ],
    [
      'plan-show-btn',
      {
        nextStepEvent: () => nextStepEvents['plan-show-btn'](),
        messages: messages['plan-show-btn'],
        tooltip: '目のアイコンをクリックしてください',
      },
    ],
    [
      'show-todo-list',
      {
        nextStepEvent: () => nextStepEvents['show-todo-list'](),
        messages: messages['show-todo-list'],
        tooltip: 'TODOリストをクリックしてください',
      },
    ],
    [
      'app-bar-btn',
      {
        nextStepEvent: () => nextStepEvents['app-bar-btn'](),
        messages: messages['app-bar-btn'],
        tooltip: 'TODOリスト新規作成をクリックしてください',
      },
    ],
    [
      'create-todo-list-input',
      {
        nextStepEvent: () => nextStepEvents['create-todo-list-input'](),
        tooltip: '「はじめてのtodoリスト」と入力してください',
      },
    ],
    [
      'create-todo-list-submit',
      {
        nextStepEvent: () => nextStepEvents['create-todo-list-submit'](),
        tooltip: 'CREATEをクリックしてください',
      },
    ],
    [
      'select-todo-list',
      {
        nextStepEvent: () => nextStepEvents['select-todo-list'](),
        messages: messages['select-todo-list'],
        tooltip: '「はじめてのtodoリスト」をクリックしてください',
      },
    ],
    [
      'create-todo-btn',
      {
        nextStepEvent: () => nextStepEvents['create-todo-btn'](),
        tooltip: '十字のボタンをクリックしてください',
      },
    ],
    [
      'create-todo-input',
      {
        nextStepEvent: () => nextStepEvents['create-todo-input'](),
        tooltip: '「はじめてのtodo」と入力してください',
      },
    ],
    [
      'create-todo-submit',
      {
        nextStepEvent: () => nextStepEvents['create-todo-submit'](),
        tooltip: 'CREATEをクリックしてください',
      },
    ],
  ])

/** チュートリアルに必要なwatchを開始する(直にwatchを書くとインポートした時点で監視が始まるため、チュートリアル開始時にメソッドとして呼び出す) */
export const tutorialWatchStart = () => {
  /**
   * 現在のシナリオキーが切り替わるたびtargetElementを更新し、achievementConditionsFuncも実行してイベント登録をする
   * チュートリアル関連のwatchの中でこれが一番最初に起動する
   * */
  watch(
    nowScenarioKey,
    async () => {
      // シナリオキーが更新され、メッセージが存在するならメッセージ表示済みフラグをfalseにする
      if (nowMessages.value.length) {
        isFinishedDisplayMsg.value = false
      }

      // ツールチップのみ先に出現することを防ぐため、ツールチップが存在していれば一旦隠す
      const tutorialTooltip = document.getElementById('tutorial-tooltip')
      if (tutorialTooltip) tutorialTooltip.style.visibility = 'hidden'

      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 300))

      targetElement.value = document.querySelector(`[data-tutorial=${nowScenarioKey.value}]`) as HTMLElement

      tutorialScenarioTable.get(nowScenarioKey.value)?.nextStepEvent()
    },
    { immediate: true }
  )

  /** メッセージが表示し終えるたび、グラデーションを選択箇所に沿って中抜きする */
  watch(
    () => [isFinishedDisplayMsg.value, targetElement.value],
    async () => {
      await nextTick()
      // DOMが中途半端に更新された状態で取得され、更にその後watchが発火しないため、遅延させ最終的なDOMを取得する
      await new Promise((resolve) => setTimeout(resolve, 300))

      tutorialDiv.value ||= document.getElementById('tutorial-div') as HTMLDivElement

      if (!tutorialDiv.value) return

      // 中抜きリセット
      tutorialDiv.value.style.clipPath = ''

      // メッセージが表示し終えていなければリターン
      if (!isFinishedDisplayMsg.value) return

      if (!tutorialDiv || !targetElement.value) return

      // 選択箇所の位置情報取得
      const targetRect = targetElement.value.getBoundingClientRect()

      // 選択箇所の位置をPath文字列に変換
      const { top, left, width, height } = targetRect
      const targetRectPath = `M ${left} ${top}  h ${width} v ${height} h -${width} z`

      // 画面全体の位置をPath文字列に変換
      const { clientWidth, clientHeight } = tutorialDiv.value
      const displayScreenPath = `M 0 0 v ${clientHeight} h ${clientWidth} v -${clientHeight} z`

      // グラデーション中抜き
      tutorialDiv.value.style.clipPath = `path('${targetRectPath} ${displayScreenPath}')`
    },
    { immediate: true }
  )
}
