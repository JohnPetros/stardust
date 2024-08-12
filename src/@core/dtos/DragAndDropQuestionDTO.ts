import type { QuestionCodeLineDTO } from './QuestionCodeLineDTO'

export type DragAndDropQuestionDTO = {
  id: string
  type: 'drag-and-drop'
  statement: string
  picture: string
  lines: QuestionCodeLineDTO[]
  items: Array<{
    index: number
    label: string
  }>
  correctItemsIndexesSequence: number[]
}
