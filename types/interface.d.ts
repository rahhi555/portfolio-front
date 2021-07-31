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
}