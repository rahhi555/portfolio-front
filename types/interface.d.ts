declare module 'interface' {
  interface SvgBase {
    id: number
    todoListId: number | null
    userId: number | null
    mapId: number
    type: string
    x: number
    y: number
    fill: string
    stroke: string
    planId: string | number
    name: string
    displayOrder: number
    isUpdated?: boolean
    createdAt: Date
    updatedAt: Date
  }

  export interface Rect extends SvgBase {
    width: number,
    height: number,
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
    roleId: number
    planId: number
    accept: boolean
    userName: string
    roleName: string
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
    address: string
    bounds: google.maps.LatLngBoundsLiteral
    heading: number
  }

  export interface Todo {
    id: number
    todoListId: number
    title: string
    body: string
    beginTime: Date
    endTime: Date
    status: 'todo' | 'doing' | 'done'
    images: string[]
  }

  export interface TodoList {
    id: number
    planId: number
    title: string
    todos?: Todo[]
  }

  export interface AppBarTab {
    name: string
    link: string
    selected: boolean
  }

  export interface AppBarFunc {
    func: Function
    name: string
  }
}