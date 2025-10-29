import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import { QuizArrangerView } from './QuizArrangerView'

export const QuizArranger = () => {
  const {
    questions,
    selectedQuestion,
    selectQuestion,
    removeQuestion,
    reorderQuestions,
  } = useQuizContext()

  return (
    <QuizArrangerView
      questions={questions}
      selectedQuestionId={selectedQuestion.id}
      onSelectQuestion={selectQuestion}
      onRemoveQuestion={removeQuestion}
      onDragEnd={reorderQuestions}
    />
  )
}
