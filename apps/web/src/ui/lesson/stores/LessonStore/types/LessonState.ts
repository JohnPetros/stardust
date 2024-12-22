import type { Quiz, Theory } from '@stardust/core/lesson/structs'
import type { LessonStage } from '@stardust/core/lesson/types'

export type LessonState = {
  stage: LessonStage
  theory: Theory | null
  quiz: Quiz | null
}
