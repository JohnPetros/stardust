import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import { QuizBankView } from './QuizBankView'

export const QuizBank = () => {
  const { addQuestion } = useQuizContext()

  return <QuizBankView onSelectQuestion={addQuestion} />
}
