import { useQuizContext } from '@/ui/global/hooks/useQuizContext'

export function useQuizArranger() {
  const { questions, selectedQuestion, selectQuestion } = useQuizContext()

  return { questions, selectedQuestion, selectQuestion }
}
