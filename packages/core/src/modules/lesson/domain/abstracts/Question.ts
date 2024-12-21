import type { Image, Logical, QuestionAnswer, Text } from '#domain/structs'
import type { QuestionProps, QuestionType } from '../../types'
import { Entity } from '../global/Entity'

export abstract class Question extends Entity<QuestionProps> {
  abstract verifyUserAnswer(userAnswer: QuestionAnswer): Logical
}
