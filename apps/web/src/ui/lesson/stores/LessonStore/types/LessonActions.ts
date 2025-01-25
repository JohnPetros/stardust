import type { Quiz, Story } from '@stardust/core/lesson/structs'
import type { LessonStage } from '@stardust/core/lesson/types'

export type LessonActions = {
  setStage: (stage: LessonStage) => void
  setStory: (story: Story) => void
  setQuiz: (quiz: Quiz) => void
  resetStore: () => void
}
