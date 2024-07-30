import type { Image, Integer, Logical, QuestionAnswer } from '../structs'
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
  statement: string
  picture: Image
  position: Integer
}

export abstract class Question extends BaseEntity {
  readonly type: QuestionType
  readonly statement: string
  readonly picture: Image
  readonly position: Integer

  constructor(props: QuestionProps) {
    super(props.id)
    this.type = props.type
    this.statement = props.statement
    this.picture = props.picture
    this.position = props.position
  }

  abstract verifyUserAnswer(userAnswer: QuestionAnswer): Logical
}
