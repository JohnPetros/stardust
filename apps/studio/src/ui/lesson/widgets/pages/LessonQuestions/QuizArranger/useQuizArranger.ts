import { useQuizContext } from '@/ui/global/hooks/useQuizContext'

export function useQuizArranger() {
  const { questions, selectedQuestionIndex, selectQuestion } = useQuizContext()

  return { questions, selectedQuestionIndex, selectQuestion }
}
