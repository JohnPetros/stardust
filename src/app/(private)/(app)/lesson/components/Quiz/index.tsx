'use client'

import { useLesson } from '@/hooks/useLesson'
import { SelectionQuestion } from './SelectionQuestion'
import { VerificationButton } from './VerificationButton'

export function Quiz() {
  const {
    state: {
      currentQuestionIndex,
      questions,
      answerHandler,
      isAnswerVerified,
      isAnswerCorrect,
      isAnswered,
    },
    dispatch,
  } = useLesson()

  const currentQuestion = questions[currentQuestionIndex]?.content

  if (currentQuestion)
    return (
      <div className="relative">
        <div className="mx-auto mt-16 w-full max-w-xl">
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
          isAnswerCorrect={isAnswerCorrect}
          isAnswerVerified={isAnswerVerified}
          isAnswered={isAnswered}
        />
      </div>
    )
}
