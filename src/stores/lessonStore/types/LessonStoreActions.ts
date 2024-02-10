import { Question } from '@/@types/Quiz'

export type LessonStoreActions = {
  showQuiz: () => void
  changeQuestion: () => void
  setQuestions: (questions: Question[]) => void
  setMdxComponentsCount: (mdxComponentsCount: number) => void
  setIsAnswered: (isAnswered: boolean) => void
  setIsAnswerCorrect: (isAnswered: boolean) => void
  setIsAnswerVerified: (isAnswered: boolean) => void
  setAnswerHandler: (answeredHandler: VoidFunction) => void
  incrementIncorrectAswersCount: () => void
  incrementRenderedMdxComponentsCount: () => void
  decrementLivesCount: () => void
  resetState: () => void
}
