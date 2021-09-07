declare module 'interface' {
  export interface Rect {
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    fill?: string,
    stroke?: string
  }
  
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