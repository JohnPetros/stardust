import { Entity } from '#global/abstracts'
import type { Logical, UserAnswer } from '#global/structs'
import type { QuestionProps } from '#lesson/types'

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
}
