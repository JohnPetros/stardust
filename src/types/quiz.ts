export interface SelectionQuestion {
  type: 'selection'
  title: string
  picture?: string
  options: string[]
  answer: string
  code?: string
}

export interface CheckboxQuestion {
  type: 'checkbox'
  title: string
  picture?: string
  options: string[]
  correctOptions: string[]
  code?: string
}

export interface OpenQuestion {
  type: 'open'
  title: string
  picture?: string
  code?: string
  answer: string[]
}

type Line = {
  id: number
  texts: string[]
  indentation: number
}

export type DraggrableItem = {
  id: number
  label: string
  dropZoneId: string
}

export interface DragAndDropClick {
  type: 'drag-and-drop-click'
  title: string
  picture?: string
  lines: Line[]
  dragItems: DraggrableItem[]
  correctDragItemsIdsSequence: Pick<DraggrableItem, 'id'>[]
}

export type SortableItem = {
  id: number
  label: string
}

export interface DragAndDropList {
  type: 'drag-and-drop-list'
  title: string
  picture?: string
  items: SortableItem[]
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
