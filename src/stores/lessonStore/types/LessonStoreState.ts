import { Question } from '@/@types/Quiz'

export type LessonStoreState = {
  currentStage: 'theory' | 'quiz' | 'rewards'
  mdxComponentsCount: number
  renderedMdxComponents: number
  questions: Question[]
  currentQuestionIndex: number
  incorrectAnswersCount: number
  livesCount: number
  answerHandler: VoidFunction
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
  isAnswered: boolean
}
