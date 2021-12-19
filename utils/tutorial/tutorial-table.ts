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
  | 'check-todo-0'
  | 'check-todo-1'
  | 'show-home-second'
  | "progress-bar"
  | "inactivate-plan"
  | "finish-tutorial"

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
  { nextStepEvent: () => void; messages: string[]; tooltip: string }
> = new Map([
  [
    'create-plan-btn',
    {
      nextStepEvent: () => nextStepEvents['create-plan-btn'](),
      messages: messages['create-plan-btn'],
      tooltip: '計画作成をクリック',
    },
  ],
  [
    'create-plan-input',
    {
      nextStepEvent: () => nextStepEvents['create-plan-input'](),
      messages: messages['create-plan-input'],
      tooltip: '「日比谷公園ボランティア」と入力',
    },
  ],
  [
    'create-plan-check',
    {
      nextStepEvent: () => nextStepEvents['create-plan-check'](),
      messages: messages['create-plan-check'],
      tooltip: 'チェックボックスをクリック',
    },
  ],
  [
    'create-plan-submit',
    {
      nextStepEvent: () => nextStepEvents['create-plan-submit'](),
      messages: messages['create-plan-submit'],
      tooltip: 'CREATEをクリック',
    },
  ],
  [
    'plan-show-btn',
    {
      nextStepEvent: () => nextStepEvents['plan-show-btn'](),
      messages: messages['plan-show-btn'],
      tooltip: '目のアイコンをクリック',
    },
  ],
  [
    'show-todo-list',
    {
      nextStepEvent: () => nextStepEvents['show-todo-list'](),
      messages: messages['show-todo-list'],
      tooltip: 'TODOリストをクリック',
    },
  ],
  [
    'create-todo-list-app-bar-btn',
    {
      nextStepEvent: () => nextStepEvents['create-todo-list-app-bar-btn'](),
      messages: messages['create-todo-list-app-bar-btn'],
      tooltip: 'TODOリスト新規作成をクリック',
    },
  ],
  [
    'create-todo-list-input',
    {
      nextStepEvent: () => nextStepEvents['create-todo-list-input'](),
      messages: messages['create-todo-list-input'],
      tooltip: '「レストラン周辺」と入力',
    },
  ],
  [
    'create-todo-list-submit',
    {
      nextStepEvent: () => nextStepEvents['create-todo-list-submit'](),
      messages: messages['create-todo-list-submit'],
      tooltip: 'CREATEをクリック',
    },
  ],
  [
    'select-todo-list',
    {
      nextStepEvent: () => nextStepEvents['select-todo-list'](),
      messages: messages['select-todo-list'],
      tooltip: '「レストラン周辺」をクリック',
    },
  ],
  [
    'create-todo-btn',
    {
      nextStepEvent: () => nextStepEvents['create-todo-btn'](),
      messages: messages['create-todo-btn'],
      tooltip: '十字のボタンをクリック',
    },
  ],
  [
    'create-todo-input',
    {
      nextStepEvent: () => nextStepEvents['create-todo-input'](),
      messages: messages['create-todo-input'],
      tooltip: '「ゴミ拾い」と入力',
    },
  ],
  [
    'create-todo-submit',
    {
      nextStepEvent: () => nextStepEvents['create-todo-submit'](),
      messages: messages['create-todo-submit'],
      tooltip: 'CREATEをクリック',
    },
  ],
  [
    'show-edit-map',
    {
      nextStepEvent: () => nextStepEvents['show-edit-map'](),
      messages: messages['show-edit-map'],
      tooltip: 'マップ編集をクリック',
    },
  ],
  [
    'create-map-app-bar-btn',
    {
      nextStepEvent: () => nextStepEvents['create-map-app-bar-btn'](),
      messages: messages['create-map-app-bar-btn'],
      tooltip: 'マップ作成をクリック',
    },
  ],
  [
    'create-map-input',
    {
      nextStepEvent: () => nextStepEvents['create-map-input'](),
      messages: messages['create-map-input'],
      tooltip: '「日比谷公園」と入力',
    },
  ],
  [
    'create-map-check',
    {
      nextStepEvent: () => nextStepEvents['create-map-check'](),
      messages: messages['create-map-check'],
      tooltip: 'チェックボックスをクリック',
    },
  ],
  [
    'create-map-submit',
    {
      nextStepEvent: () => nextStepEvents['create-map-submit'](),
      messages: messages['create-map-submit'],
      tooltip: 'マップ作成をクリック',
    },
  ],
  [
    'change-google-map-mode',
    {
      nextStepEvent: () => nextStepEvents['change-google-map-mode'](),
      messages: messages['change-google-map-mode'],
      tooltip: 'トグルスイッチをクリック',
    },
  ],
  [
    'input-google-map-search',
    {
      nextStepEvent: () => nextStepEvents['input-google-map-search'](),
      messages: messages['input-google-map-search'],
      tooltip: '「日比谷公園」と入力し、Enterキーを押下',
    },
  ],
  [
    'set-google-map-center',
    {
      nextStepEvent: () => nextStepEvents['set-google-map-center'](),
      messages: messages['set-google-map-center'],
      tooltip: 'ピンアイコンをクリック',
    },
  ],
  [
    'add-rect',
    {
      nextStepEvent: () => nextStepEvents['add-rect'](),
      messages: messages['add-rect'],
      tooltip: '図形アイコンをクリック',
    },
  ],
  [
    'drag-and-save-rect',
    {
      nextStepEvent: () => nextStepEvents['drag-and-save-rect'](),
      messages: messages['drag-and-save-rect'],
      tooltip: '図形を赤枠内にドラッグ',
    },
  ],
  [
    'attach-todo-list',
    {
      nextStepEvent: () => nextStepEvents['attach-todo-list'](),
      messages: messages['attach-todo-list'],
      tooltip: 'todoリストを図形にドラッグ',
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
      messages: messages['show-member'],
      tooltip: 'メンバー一覧をクリック',
    },
  ],
  [
    'accept-member',
    {
      nextStepEvent: () => nextStepEvents['accept-member'](),
      messages: messages['accept-member'],
      tooltip: '人物アイコンをクリック',
    },
  ],
  [
    'show-home',
    {
      nextStepEvent: () => nextStepEvents['show-home'](),
      messages: messages['show-home'],
      tooltip: 'ホームをクリック',
    },
  ],
  [
    'activate-plan',
    {
      nextStepEvent: () => nextStepEvents['activate-plan'](),
      messages: messages['activate-plan'],
      tooltip: '計画開始をクリック',
    },
  ],
  [
    'show-map',
    {
      nextStepEvent: () => nextStepEvents['show-map'](),
      messages: messages['show-map'],
      tooltip: 'マップ閲覧をクリック',
    },
  ],
  [
    'click-rect',
    {
      nextStepEvent: () => nextStepEvents['click-rect'](),
      messages: messages['click-rect'],
      tooltip: '図形をクリック',
    },
  ],
  [
    'check-todo-0',
    {
      nextStepEvent: () => nextStepEvents['check-todo'](),
      messages: messages['check-todo'],
      tooltip: 'チェックをクリック',
    },
  ],
  [
    'show-home-second',
    {
      nextStepEvent: () => nextStepEvents['show-home-second'](),
      messages: messages['show-home-second'],
      tooltip: 'ホームをクリック',
    },
  ],
  [
    'progress-bar',
    {
      nextStepEvent: () => nextStepEvents['progress-bar'](),
      messages: messages['progress-bar'],
      tooltip: '進行状況が表示されます',
    },
  ],
  [
    'inactivate-plan',
    {
      nextStepEvent: () => nextStepEvents['inactivate-plan'](),
      messages: messages['inactivate-plan'],
      tooltip: '計画終了をクリック',
    },
  ],
  [
    'finish-tutorial',
    {
      nextStepEvent: () => nextStepEvents['finish-tutorial'](),
      messages: messages['finish-tutorial'],
      tooltip: 'お疲れさまでした',
    },
  ],
])
