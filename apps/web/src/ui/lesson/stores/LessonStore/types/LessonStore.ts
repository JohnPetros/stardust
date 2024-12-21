import type { LessonActions } from './LessonActions'
import type { LessonState } from './LessonState'

export type LessonStore = {
  state: LessonState
  actions: LessonActions
}
