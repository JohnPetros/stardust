import type { LessonStoreState } from '../types/LessonStoreState'

export const INITIAL_LESSON_STORE_STATE: LessonStoreState = {
  currentStage: 'theory',
  mdxComponentsCount: 0,
  renderedMdxComponents: 0,
  questions: [],
  currentQuestionIndex: 0,
  incorrectAnswersCount: 0,
  livesCount: 5,
  answerHandler: () => {},
  isAnswerCorrect: false,
  isAnswerVerified: false,
  isAnswered: false,
}
