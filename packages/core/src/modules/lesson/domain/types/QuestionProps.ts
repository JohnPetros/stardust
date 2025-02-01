import type { Image, Text } from '#global/structs'
import type { QuestionType } from './QuestionType'

export type QuestionProps = {
  id?: string
  type: QuestionType
  stem: Text
  picture: Image
}
