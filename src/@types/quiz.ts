export interface SelectionQuestion {
  type: 'selection'
  title: string
  picture: string
  options: string[]
  answer: string
  code?: string
}

export interface CheckboxQuestion {
  type: 'checkbox'
  title: string
  picture: string
  options: string[]
  correctOptions: string[]
  code?: string
}

export interface OpenQuestion {
  type: 'open'
  title: string
  picture: string
  code?: string
  answers: string[]
  lines: Line[]
}

type Line = {
  id: number
  texts: string[]
  indentation: number
}

export type DraggrableItem = {
  id: number
  label: string
  dropZoneId?: string
}

export interface DragAndDropQuestion {
  type: 'drag-and-drop'
  title: string
  picture: string
  lines: Line[]
  dragItems: DraggrableItem[]
  correctDragItemsIdsSequence: number[]
}

export type SortableItem = {
  id: number
  label: string
}

export interface DragAndDropListQuestion {
  type: 'drag-and-drop-list'
  title: string
  picture: string
  items: SortableItem[]
}

export type QuestionContent =
  | SelectionQuestion
  | CheckboxQuestion
  | OpenQuestion
  | DragAndDropQuestion
  | DragAndDropListQuestion

export type Question = {
  id: string
  content: QuestionContent
  order: number
  star_id: string
}
