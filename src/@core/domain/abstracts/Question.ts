import type { Image, Logical, QuestionAnswer, Text } from '../structs'
import { BaseEntity } from './BaseEntity'

type QuestionType =
  | 'selection'
  | 'checkbox'
  | 'open'
  | 'drag-and-drop'
  | 'drag-and-drop-list'

export type QuestionProps = {
  id?: string
  type: QuestionType
  statement: Text
  picture: Image
}

export abstract class Question extends BaseEntity {
  readonly type: QuestionType
  readonly statement: Text
  readonly picture: Image

  constructor(props: QuestionProps) {
    super(props.id)
    this.type = props.type
    this.statement = props.statement
    this.picture = props.picture
  }

  abstract verifyUserAnswer(userAnswer: QuestionAnswer): Logical
}
