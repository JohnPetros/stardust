export interface SelectionQuestion {
  stem: string
  type: 'selection'
  options: string[]
  answer: string
  code?: string
}

export interface CheckboxQuestion {
  stem: string
  type: 'checkbox'
  options: string[]
  correctOptions: string[]
  code?: string
}

export interface OpenQuestion {
  stem: string
  type: 'open'
  answer: string
  code?: string
}

type Line = {
  id: number
  texts: string[]
  indentation: number
}

type DropItem = {
  id: number
  label: string
}

export interface DragAndDropClick {
  stem: string
  type: 'drag-and-drop-click'
  lines: Line[]
  correctItemsIdsSequence: number[]
  dropItems: DropItem[]
}

type Item = {
  id: number
  label: string
}

export interface DragAndDropList {
  stem: string
  type: 'drag-and-drop-list'
  items: Item[]
}

export type Question =
  | SelectionQuestion
  | CheckboxQuestion
  | OpenQuestion
  | DragAndDropClick
  | DragAndDropList
