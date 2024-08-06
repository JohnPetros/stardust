import type { QuestionCodeLineDTO } from './QuestionCodeLineDTO'

export type DragAndDropQuestionDTO = {
  id: string
  type: 'drag-and-drop'
  statement: string
  picture: string
  lines: QuestionCodeLineDTO[]
  items: Array<{
    id: number
    label: string
  }>
  correctDragItemsIdsSequence: number[]
}
