import type { OpenQuestionDto } from './OpenQuestionDto'
import type { DragAndDropListQuestionDto } from './DragAndDropListQuestionDto'
import type { DragAndDropQuestionDto } from './DragAndDropQuestionDto'
import type { SelectionQuestionDto } from './SelectionQuestionDto'
import type { CheckboxQuestionDto } from './CheckboxQuestionDto'

export type QuestionDto =
  | SelectionQuestionDto
  | CheckboxQuestionDto
  | OpenQuestionDto
  | DragAndDropListQuestionDto
  | DragAndDropQuestionDto
