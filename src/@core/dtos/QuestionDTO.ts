import type { OpenQuestionDTO } from './OpenQuestionDTO'
import type { DragAndDropListQuestionDTO } from './DragAndDropListQuestionDTO'
import type { SelectionQuestionDTO } from './SelectionQuestionDTO'

export type QuestionDTO =
  | SelectionQuestionDTO
  | OpenQuestionDTO
  | DragAndDropListQuestionDTO
