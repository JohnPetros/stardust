import type { Image, Text } from '../../structs'
import type { QuestionType } from './QuestionType'

export type QuestionProps = {
  id?: string
  type: QuestionType
  statement: Text
  picture: Image
}
