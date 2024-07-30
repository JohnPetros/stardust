import type { QuestionAnswer, Quiz, Theory } from '@/@core/domain/structs'
import type { LessonStage } from '@/@core/domain/types'

export type LessonState = {
  stage: LessonStage
  theory: Theory | null
  quiz: Quiz | null
  answerHandler: VoidFunction
}
