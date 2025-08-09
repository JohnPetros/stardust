import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import { QuizArrangerView } from './QuizArrangerView'

export const QuizArranger = () => {
  const {
    questions,
    selectedQuestionIndex,
    selectQuestion,
    removeQuestion,
    reorderQuestions,
  } = useQuizContext()

  return (
    <QuizArrangerView
      questions={questions}
      selectedQuestionIndex={selectedQuestionIndex}
      onSelectQuestion={selectQuestion}
      onRemoveQuestion={removeQuestion}
      onDragEnd={reorderQuestions}
    />
  )
}
