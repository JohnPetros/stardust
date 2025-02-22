import type { LessonState } from '../types/LessonState'

export const INITIAL_LESSON_STATE: LessonState = {
  stage: 'story',
  story: null,
  quiz: null,
}
