import type { LessonState } from '../types/LessonState'

export const INITIAL_LESSON_STATE: LessonState = {
  stage: 'quiz',
  theory: null,
  quiz: null,
}