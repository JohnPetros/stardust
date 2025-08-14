import { Entity } from '../../../global/domain/abstracts'
import type { Image } from '#global/domain/structures/Image'
import type { Text } from '#global/domain/structures/Text'
import type { Logical, UserAnswer } from '../../../global/domain/structures'
import type { QuestionDto } from '../entities/dtos'
import type { QuestionProps, QuestionType } from '../types'

export abstract class Question<Props = unknown> extends Entity<QuestionProps & Props> {
  abstract verifyUserAnswer(userAnswer: UserAnswer): Logical

  get type(): QuestionType {
    return this.props.type
  }

  get stem(): Text {
    return this.props.stem
  }

  set stem(stem: Text) {
    this.props.stem = stem
  }

  get picture(): Image {
    return this.props.picture
  }

  set picture(picture: Image) {
    this.props.picture = picture
  }

  abstract get dto(): QuestionDto
}
