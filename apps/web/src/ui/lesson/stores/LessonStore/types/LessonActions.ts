import type { Quiz, Story } from '@stardust/core/lesson/structures'
import type { LessonStage } from '@stardust/core/lesson/types'

export type LessonActions = {
  setStage: (stage: LessonStage) => void
  setStory: (story: Story) => void
  setQuiz: (quiz: Quiz | null) => void
  resetStore: () => void
}
