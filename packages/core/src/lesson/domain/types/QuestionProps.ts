import type { Image, Text } from '../../../global/domain/structures'
import type { QuestionType } from './QuestionType'

export type QuestionProps = {
  id?: string
  type: QuestionType
  stem: Text
  picture: Image
}
