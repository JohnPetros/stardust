import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import type { QuestionType } from '@stardust/core/lesson/types'
import type { Question } from '@stardust/core/lesson/abstracts'

export type QuizContextValue = {
  questions: SortableItem<Question>[]
  selectedQuestion: SortableItem<Question>
  selectQuestion: (questionId: string) => void
  addQuestion: (questionType: QuestionType) => void
  replaceSelectedQuestion: (question: Question) => void
  removeQuestion: (questionId: string) => void
  reorderQuestions: (
    questions: SortableItem<Question>[],
    originQuestionId: string,
    targetQuestionId: string,
  ) => void
}
