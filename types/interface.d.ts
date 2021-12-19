declare module 'interface' {
  interface SvgBase {
    id: number
    todoListId?: number | null
    userId: number | null
    mapId: number
    type: string
    x: number
    y: number
    fill?: string
    stroke?: string
    planId: string | number
    name: string
    displayOrder: number
    isUpdated?: boolean
    createdAt?: Date
    updatedAt?: Date
  }

  export interface Rect extends SvgBase {
    width: number
    height: number
  }

  export interface Path extends SvgBase {
    displayTime: number
    drawPoints: string
  }

  export interface Polyline extends SvgBase {
    displayTime: number
    drawPoints: string
  }

  export type AllSvgType = Rect & Path & Polyline

  export interface Member {
    id: number
    userId: number
    roleId?: number
    planId: number
    accept: boolean
    userName: string
    roleName?: string
    avatar?: string
  }

  export interface Plan {
    id: number
    userId: number
    name: string
    members: Member[]
    author: string
    published: boolean
    active: boolean
    createdAt: string
    updatedAt: string
  }

  export interface Role {
    id: number
    planId: number
    name: string
    description: string
  }

  export interface Map {
    id: number
    planId: number
    name: string
    isGoogleMap: boolean
    address?: string
    bounds?: google.maps.LatLngBoundsLiteral
    heading?: number
    width?: number
    height?: number
  }

  export interface Todo {
    id: number
    todoListId: number
    title: string
    body?: string
    beginTime?: string
    endTime?: string
    images?: string[]
  }

  export interface TodoList {
    id: number
    planId: number
    title: string
    todos?: Todo[]
  }

  /** todoにマージする際にidキーが重複するため、todoStatusIdに代入し、idをdeleteする */
  export interface TodoStatus {
    id?: number
    todoStatusId?: number
    svgId: number
    todoId: number
    status: 'todo' | 'doing' | 'done'
  }

  /**
   * name: AppBarに表示される名前
   * link: url
   * selected: 該当ページにアクセス中かどうか
   * activePlanIgnore: trueなら計画実行中の場合表示しない
   */
  export interface AppBarTab {
    name: string
    link: string
    selected: boolean
    activePlanIgnore: boolean
  }

  export interface AppBarFunc {
    func: Function
    name: string
  }

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
    | 'progress-bar'
    | 'inactivate-plan'
    | 'finish-tutorial'
}
