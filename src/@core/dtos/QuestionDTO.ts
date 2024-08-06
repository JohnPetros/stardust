import type { OpenQuestionDTO } from './OpenQuestionDTO'
import type { DragAndDropListQuestionDTO } from './DragAndDropListQuestionDTO'
import type { DragAndDropQuestionDTO } from './DragAndDropQuestionDTO'
import type { SelectionQuestionDTO } from './SelectionQuestionDTO'

export type QuestionDTO =
  | SelectionQuestionDTO
  | OpenQuestionDTO
  | DragAndDropListQuestionDTO
  | DragAndDropQuestionDTO
