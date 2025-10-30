import type { QuestionType } from '@stardust/core/lesson/types'
import type { Question } from '@stardust/core/lesson/abstracts'

import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'

export type QuizContextValue = {
  questions: SortableItem<Question>[]
  selectedQuestion: SortableItem<Question> | null
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
