'use client'

import { useEffect, useMemo } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { SelectionQuestion } from './SelectionQuestion'
import { VerificationButton } from './VerificationButton'
import { DragAndDropListQuestion } from './DragAndDropListQuestion'
import { Variants } from 'framer-motion'

export const questionAnimations: Variants = {
  right: {
    position: 'absolute',
    opacity: 0,
    x: 64,
  },
  middle: {
    opacity: 1,
    x: 0,
  },
  left: {
    position: 'absolute',
    opacity: 0,
    x: -64,
  },
}

export const questionTransition = {
  duration: 0.5,
  ease: 'easeInOut',
}

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

  const currentQuestion = useMemo(() => {
    return questions.length ? questions[currentQuestionIndex] : null
  }, [questions, currentQuestionIndex])

  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [currentQuestionIndex])

  if (currentQuestion)
    return (
      <div className="relative">
        <div className="mx-auto mt-16 w-full max-w-xl">
          {currentQuestion.content.type === 'selection' && (
            <SelectionQuestion
              data={currentQuestion.content}
              isCurrentQuestion={
                (currentQuestion.order - 1) === currentQuestionIndex
              }
            />
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
       */}
          {currentQuestion.content.type === 'drag-and-drop-list' && (
            <DragAndDropListQuestion
              data={currentQuestion.content}
              isCurrentQuestion={
                (currentQuestion.order - 1) === currentQuestionIndex
              }
            />
          )}
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
