import { DataTutorialKey } from "./tutorial-table"

export const messages: { [key in DataTutorialKey]: string[] } = {
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
  'create-todo-list-app-bar-btn': [],
  'create-todo-list-input': [],
  'create-todo-list-submit': [],
  'select-todo-list': ['Todoリストが作成されました。次はTodoを作成しましょう'],
  'create-todo-btn': [],
  'create-todo-input': [],
  'create-todo-submit': [],
  'show-edit-map': ['Todoが作成されました。次はマップを作成しましょう'],
  'create-map-app-bar-btn': [],
  'create-map-input': [],
  'create-map-check': [
    'チャックボックスにチェックを入れることでグーグルマップを使用します',
    '地図上に図形を作成できるほか、自分の現在位置がマップに反映されるようになります',
  ],
  'create-map-submit': ['マップが作成されました。次はグーグルマップを設定しましょう'],
  'change-google-map-mode': [],
  'input-google-map-search': ['「東京ディズニーランド」を検索してみましょう'],
  'set-google-map-center': [],
  'add-rect': ['これで位置情報の登録が完了しました', '次はこの地図に図形を配置し、オリジナルのマップを作成してみましょう']
}