import type { QuestionCodeLineDto } from './QuestionCodeLineDto'

export type DragAndDropQuestionDto = {
  id?: string
  type: 'drag-and-drop'
  statement: string
  picture: string
  lines: QuestionCodeLineDto[]
  items: Array<{
    index: number
    label: string
  }>
  correctItemsIndexesSequence: number[]
}
