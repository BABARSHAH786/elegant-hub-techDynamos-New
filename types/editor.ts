export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface DesignElement {
  id: string
  type: "text" | "image" | "shape"
  content: string
  position: Position
  size: Size
  rotation: number
  shapeType?: "rectangle" | "circle" | "triangle"
  style?: Record<string, any>
}
