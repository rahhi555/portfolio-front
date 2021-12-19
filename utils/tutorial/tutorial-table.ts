import { nextStepEvents } from '~/utils/tutorial/tutorial-table-events'
import { messages } from '~/utils/tutorial/tutorial-table-messages'

/** 全ての[data-tutorial]に指定されている値(便宜上キーと呼ぶ) */
export type DataTutorialKey =
  | 'create-plan-btn'
  | 'create-plan-input'
  | 'create-plan-check'
  | 'create-plan-submit'
  | 'plan-show-btn'
  | 'show-todo-list'
  | 'create-todo-list-app-bar-btn'
  | 'create-todo-list-input'
  | 'create-todo-list-submit'
  | 'select-todo-list'
  | 'create-todo-btn'
  | 'create-todo-input'
  | 'create-todo-submit'
  | 'show-edit-map'
  | 'create-map-app-bar-btn'
  | 'create-map-input'
  | 'create-map-check'
  | 'create-map-submit'
  | 'change-google-map-mode'
  | 'input-google-map-search'
  | 'set-google-map-center'
  | 'add-rect'
  | 'drag-and-save-rect'
  | 'attach-todo-list'
  | 'add-member'
  | 'show-member'
  | 'accept-member'
  | 'show-home'
  | 'activate-plan'
  | 'show-map'
  | 'click-rect'
  | 'check-todo'
  | 'show-home-second'
  | "progress-bar"
  | "inactivate-plan"

/**
 * チュートリアルシナリオテーブル
 * @param dataTutorial [data-tutorial]に指定された名前
 * @param nextStepEvent 達成条件の関数。これが達成されれば次のシナリオに進む
 * @param messages モーダルに表示するメッセージの配列
 * @param tooltip 操作対象の付近に出現する吹き出し
 * 配列の順番がシナリオの順番になる
 * */
export const tutorialScenarioTable: Map<
  DataTutorialKey,
  { nextStepEvent: () => void; messages?: string[]; tooltip: string }
> = new Map([
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
      // messages: messages['create-plan-check'],
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
      // messages: messages['plan-show-btn'],
      tooltip: '目のアイコンをクリックしてください',
    },
  ],
  [
    'show-todo-list',
    {
      nextStepEvent: () => nextStepEvents['show-todo-list'](),
      // messages: messages['show-todo-list'],
      tooltip: 'TODOリストをクリックしてください',
    },
  ],
  [
    'create-todo-list-app-bar-btn',
    {
      nextStepEvent: () => nextStepEvents['create-todo-list-app-bar-btn'](),
      // messages: messages['create-todo-list-app-bar-btn'],
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
      // messages: messages['select-todo-list'],
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
  [
    'show-edit-map',
    {
      nextStepEvent: () => nextStepEvents['show-edit-map'](),
      // messages: messages['show-edit-map'],
      tooltip: 'マップ編集をクリックしてください',
    },
  ],
  [
    'create-map-app-bar-btn',
    {
      nextStepEvent: () => nextStepEvents['create-map-app-bar-btn'](),
      tooltip: 'マップ作成をクリックしてください',
    },
  ],
  [
    'create-map-input',
    {
      nextStepEvent: () => nextStepEvents['create-map-input'](),
      tooltip: '「はじめてのマップ」と入力してください',
    },
  ],
  [
    'create-map-check',
    {
      nextStepEvent: () => nextStepEvents['create-map-check'](),
      tooltip: 'チェックしてください',
    },
  ],
  [
    'create-map-submit',
    {
      nextStepEvent: () => nextStepEvents['create-map-submit'](),
      tooltip: 'マップ作成をクリックしてください',
    },
  ],
  [
    'change-google-map-mode',
    {
      nextStepEvent: () => nextStepEvents['change-google-map-mode'](),
      tooltip: 'トグルスイッチをクリックしてください',
    },
  ],
  [
    'input-google-map-search',
    {
      nextStepEvent: () => nextStepEvents['input-google-map-search'](),
      // messages: messages['input-google-map-search'],
      tooltip: '「東京ディズニーランド」と入力し、Enterキーを押してください',
    },
  ],
  [
    'set-google-map-center',
    {
      nextStepEvent: () => nextStepEvents['set-google-map-center'](),
      tooltip: 'クリックしてください',
    },
  ],
  [
    'add-rect',
    {
      nextStepEvent: () => nextStepEvents['add-rect'](),
      // messages: messages['add-rect'],
      tooltip: '図形アイコンをクリックしてください',
    },
  ],
  [
    'drag-and-save-rect',
    {
      nextStepEvent: () => nextStepEvents['drag-and-save-rect'](),
      // messages: messages['drag-and-save-rect'],
      tooltip: '図形を赤枠内にドラッグしてください',
    },
  ],
  [
    'attach-todo-list',
    {
      nextStepEvent: () => nextStepEvents['attach-todo-list'](),
      // messages: messages['attach-todo-list'],
      tooltip: 'todoリストを図形にドラッグしてください',
    },
  ],
  [
    'add-member',
    {
      nextStepEvent: () => nextStepEvents['add-member'](),
      messages: messages['add-member'],
      tooltip: 'メンバー申請されると通知があります',
    },
  ],
  [
    'show-member',
    {
      nextStepEvent: () => nextStepEvents['show-member'](),
      // messages: messages['show-member'],
      tooltip: 'メンバー一覧をクリックしてください',
    },
  ],
  [
    'accept-member',
    {
      nextStepEvent: () => nextStepEvents['accept-member'](),
      tooltip: '人影のアイコンをクリックしてください',
    },
  ],
  [
    'show-home',
    {
      nextStepEvent: () => nextStepEvents['show-home'](),
      tooltip: 'ホームをクリックしてください',
    },
  ],
  [
    'activate-plan',
    {
      nextStepEvent: () => nextStepEvents['activate-plan'](),
      tooltip: '計画開始をクリックしてください',
    },
  ],
  [
    'show-map',
    {
      nextStepEvent: () => nextStepEvents['show-map'](),
      tooltip: 'マップ閲覧をクリックしてください',
    },
  ],
  [
    'click-rect',
    {
      nextStepEvent: () => nextStepEvents['click-rect'](),
      tooltip: '図形をクリックしてください',
    },
  ],
  [
    'check-todo',
    {
      nextStepEvent: () => nextStepEvents['check-todo'](),
      tooltip: 'チェックをクリックしてください',
    },
  ],
  [
    'show-home-second',
    {
      nextStepEvent: () => nextStepEvents['show-home-second'](),
      tooltip: 'ホームをクリックしてください',
    },
  ],
  [
    'progress-bar',
    {
      nextStepEvent: () => nextStepEvents['progress-bar'](),
      tooltip: '進行状況が表示されます',
    },
  ],
  [
    'inactivate-plan',
    {
      nextStepEvent: () => nextStepEvents['inactivate-plan'](),
      tooltip: '計画終了をクリックしてください',
    },
  ],
])
