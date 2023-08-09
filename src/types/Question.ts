export interface Question {
  stem: string
}

export interface SelectionQuestion extends Question {
  type: 'selection'
  options: string[]
  answer: string
  code?: string
}

export interface CheckboxQuestion extends Question {
  type: 'checkbox'
  options: string[]
  correctOptions: string[]
  code?: string
}

export interface OpenQuestion extends Question {
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

export interface DragAndDropClick extends Question {
  type: 'drag-and-drop-click'
  lines: Line[]
  correctItemsIdsSequence: number[]
  dropItems: DropItem[]
}

type Item = {
  id: number
  label: string
}

export interface DragAndDropList extends Question {
  type: 'drag-and-drop-list'
  items: Item[]
}
