import { Entity } from '../../../global/domain/abstracts'
import type { Logical, UserAnswer } from '../../../global/domain/structures'
import type { QuestionDto } from '../entities/dtos'
import type { QuestionProps } from '../types'

export abstract class Question<Props = unknown> extends Entity<QuestionProps & Props> {
  abstract verifyUserAnswer(userAnswer: UserAnswer): Logical

  get type() {
    return this.props.type
  }

  get stem() {
    return this.props.stem
  }

  get picture() {
    return this.props.picture
  }

  abstract get dto(): QuestionDto
}
