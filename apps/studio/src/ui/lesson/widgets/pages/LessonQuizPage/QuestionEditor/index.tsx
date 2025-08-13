import { QuestionEditorView } from './QuestionEditorView'
import { useQuizContext } from '@/ui/global/hooks/useQuizContext'

export const QuestionEditor = () => {
  const { questions, selectedQuestion } = useQuizContext()

  if (questions.length === 0) {
    return null
  }

  const question = selectedQuestion.value

  return <QuestionEditorView selectedQuestionType={question.type} />
}
