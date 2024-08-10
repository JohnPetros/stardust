import type { OpenQuestionDTO } from './OpenQuestionDTO'
import type { DragAndDropListQuestionDTO } from './DragAndDropListQuestionDTO'
import type { DragAndDropQuestionDTO } from './DragAndDropQuestionDTO'
import type { SelectionQuestionDTO } from './SelectionQuestionDTO'
import type { CheckboxQuestionDTO } from './CheckboxQuestionDTO'

export type QuestionDTO =
  | SelectionQuestionDTO
  | CheckboxQuestionDTO
  | OpenQuestionDTO
  | DragAndDropListQuestionDTO
  | DragAndDropQuestionDTO
