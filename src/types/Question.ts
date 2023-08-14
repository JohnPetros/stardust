export interface SelectionQuestion {
  title: string
  picture?: string
  type: 'selection'
  options: string[]
  answer: string
  code?: string
}

export interface CheckboxQuestion {
  title: string
  picture?: string
  type: 'checkbox'
  options: string[]
  correctOptions: string[]
  code?: string
}

export interface OpenQuestion {
  title: string
  picture?: string
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
  title: string
  picture?: string
  type: 'drag-and-drop-click'
  lines: Line[]
  correctItemsIdsSequence: number[]
  dropItems: DropItem[]
}

export type Item = {
  id: number
  label: string
}

export interface DragAndDropList {
  title: string
  picture?: string
  type: 'drag-and-drop-list'
  items: Item[]
}

export type QuestionContent =
  | SelectionQuestion
  | CheckboxQuestion
  | OpenQuestion
  | DragAndDropClick
  | DragAndDropList

export type Question = {
  id: string
  content: QuestionContent
  order: number
  star_id: string
}
