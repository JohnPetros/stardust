import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { QuestionType } from '@stardust/core/lesson/types'

export type QuizContextValue = {
  questions: QuestionDto[]
  selectedQuestionIndex: number
  selectQuestion: (questionIndex: number) => void
  addQuestion: (questionType: QuestionType) => void
  removeQuestion: (questionIndex: number) => void
  reorderQuestions: (originQuestionIndex: number, targetQuestionIndex: number) => void
}
