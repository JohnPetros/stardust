import type { Image, Logical, QuestionAnswer, Text } from '../structs'
import type { QuestionProps, QuestionType } from '../types'
import { Entity } from './Entity'

export abstract class Question extends Entity {
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
