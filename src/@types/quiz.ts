export type SelectionQuestion = {
  type: 'selection'
  title: string
  picture: string
  options: string[]
  answer: string
  code?: string
}

export type CheckboxQuestion = {
  type: 'checkbox'
  title: string
  picture: string
  options: string[]
  correctOptions: string[]
  code?: string
}

type Line = {
  id: number
  texts: string[]
  indentation: number
}

export type OpenQuestion = {
  type: 'open'
  title: string
  picture: string
  code?: string
  answers: string[]
  lines: Line[]
}

export type DraggrableItem = {
  id: number
  label: string
  dropZoneId?: string
}

export type DragAndDropQuestion = {
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

export type DragAndDropListQuestion = {
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
  index?: number
}
