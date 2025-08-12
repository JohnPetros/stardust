import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import type { QuestionType } from '@stardust/core/lesson/types'
import type { Question } from '@stardust/core/lesson/abstracts'

export type QuizContextValue = {
  questions: SortableItem<Question>[]
  selectedQuestionIndex: number
  selectQuestion: (questionIndex: number) => void
  addQuestion: (questionType: QuestionType) => void
  removeQuestion: (questionIndex: number) => void
  reorderQuestions: (
    questions: SortableItem<Question>[],
    originQuestionIndex: number,
    targetQuestionIndex: number,
  ) => void
}
