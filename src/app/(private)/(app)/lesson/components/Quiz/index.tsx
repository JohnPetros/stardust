'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { SelectionQuestion } from './SelectionQuestion'
import { VerificationButton } from './VerificationButton'
import { DragAndDropListQuestion } from './DragAndDropListQuestion'
import { Variants } from 'framer-motion'
import { OpenQuestion } from './OpenQuestion'
import { Modal, ModalRef } from '@/app/components/Modal'
import { Button } from '@/app/components/Button'

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

interface QuizProps {
  leaveLesson: () => void
}

export function Quiz({ leaveLesson }: QuizProps) {
  const {
    state: {
      currentQuestionIndex,
      questions,
      answerHandler,
      isAnswerVerified,
      isAnswerCorrect,
      isAnswered,
      livesAmount,
    },
    dispatch,
  } = useLesson()

  const currentQuestion = useMemo(() => {
    return questions.length ? questions[currentQuestionIndex] : null
  }, [questions, currentQuestionIndex])

  const modalRef = useRef<ModalRef>(null)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [currentQuestionIndex])

  useEffect(() => {
    if (livesAmount === 0) modalRef.current?.open()
  }, [livesAmount])

  if (currentQuestion)
    return (
      <div className="relative">
        <div className="mx-auto w-full h-[75vh] max-w-xl flex items-center">
          {currentQuestion.content.type === 'selection' && (
            <SelectionQuestion
              data={currentQuestion.content}
              isCurrentQuestion={
                currentQuestion.order - 1 === currentQuestionIndex
              }
            />
          )}

          {currentQuestion.content.type === 'open' && (
            <OpenQuestion
              data={currentQuestion.content}
              isCurrentQuestion={
                currentQuestion.order - 1 === currentQuestionIndex
              }
            />
          )}

          {/* {currentQuestion.type === 'checkbox' && (
        <CheckboxQuestion data={currentQuestion} />
      )}
    
      {currentQuestion.type === 'drag-and-drop-click' && (
        <DragAndDropClickQuestion data={currentQuestion} />
      )}
       */}
          {currentQuestion.content.type === 'drag-and-drop-list' && (
            <DragAndDropListQuestion
              data={currentQuestion.content}
              isCurrentQuestion={
                currentQuestion.order - 1 === currentQuestionIndex
              }
            />
          )}
        </div>

        <Modal
          ref={modalRef}
          type="crying"
          title="Puxa, parece que você não tem mais vidas!"
          body={
            <p className="text-center text-green-400 font-medium mt-3">
              Mais sorte da próxima vez 😢
            </p>
          }
          footer={
            <div className="flex items-center justify-center mt-3 gap-2">
              <Button
                className="bg-red-700 text-gray-100 w-32"
                onClick={leaveLesson}
              >
                Sair
              </Button>
            </div>
          }
        />

        <VerificationButton
          answerHandler={answerHandler}
          isAnswerCorrect={isAnswerCorrect}
          isAnswerVerified={isAnswerVerified}
          isAnswered={isAnswered}
        />
      </div>
    )
}
