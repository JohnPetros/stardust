import { useLesson } from '@/hooks/useLesson'
import { SelectionQuestion } from './SelectionQuestion'
import { VerificationButton } from './VerificationButton'

export function Quiz() {
  const {
    state: {
      currentQuestionIndex,
      questions,
      answerHandler,
      isAnswerWrong,
      isAnswerVerified,
      isAnswered,
    },
    dispatch,
  } = useLesson()

  const currentQuestion = questions[currentQuestionIndex]
  
  console.log(currentQuestion)

  return (
    <div>
      <div className="flex items-center justify-center mt-20">
        {currentQuestion.type === 'selection' && (
          <SelectionQuestion data={currentQuestion} />
        )}

        {/* {currentQuestion.type === 'checkbox' && (
        <CheckboxQuestion data={currentQuestion} />
      )}
      {currentQuestion.type === 'open' && (
        <OpenQuestion data={currentQuestion} />
      )}
      {currentQuestion.type === 'drag-and-drop-click' && (
        <DragAndDropClickQuestion data={currentQuestion} />
      )}
      {currentQuestion.type === 'drag-and-drop-list' && (
        <DragAndDropListQuestion data={currentQuestion} />
      )} */}
      </div>

      <VerificationButton
        answerHandler={answerHandler}
        isAnswerWrong={isAnswerWrong}
        isAnswerVerified={isAnswerVerified}
        isAnswered={isAnswered}
      />
    </div>
  )
}
