import type { Quiz, Story } from '@stardust/core/lesson/structs'
import type { LessonStage } from '@stardust/core/lesson/types'

export type LessonState = {
  stage: LessonStage
  story: Story | null
  quiz: Quiz | null
}
