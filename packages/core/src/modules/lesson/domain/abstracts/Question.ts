import { Entity } from '#global/abstracts'
import type { Logical } from '#global/structs'
import type { QuestionAnswer } from '#lesson/structs'
import type { QuestionProps } from '#lesson/types'

export abstract class Question<Props = unknown> extends Entity<QuestionProps & Props> {
  abstract verifyUserAnswer(userAnswer: QuestionAnswer): Logical
}
