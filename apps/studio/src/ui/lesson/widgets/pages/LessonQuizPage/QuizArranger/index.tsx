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
      selectedQuestionIndex={selectedQuestion.index}
      onSelectQuestion={selectQuestion}
      onRemoveQuestion={removeQuestion}
      onDragEnd={reorderQuestions}
    />
  )
}
