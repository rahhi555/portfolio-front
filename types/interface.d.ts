declare module 'interface' {
  interface SvgBase {
    id: number
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
  
  export type SvgType = Rect & Path & Polyline

  export interface SVGRectMouseEvent extends MouseEvent {
    target: SVGRectElement
  }

  export interface SVGRectKeyboardEvent extends KeyboardEvent {
    target: SVGRectElement
  }

  export interface Member {
    id: number
    userId: number
    roleId: number
    planId: number
    accept: boolean
    userName: string
    roleName: string
  }
  
  export interface Plan {
    id: number
    userId: number
    name: string
    members: Member[]
    author: string
    published: boolean
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