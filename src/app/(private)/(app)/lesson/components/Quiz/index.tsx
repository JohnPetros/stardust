'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { SelectionQuestion } from './SelectionQuestion'
import { VerificationButton } from './VerificationButton'
import { DragAndDropListQuestion } from './DragAndDropListQuestion'
import { OpenQuestion } from './OpenQuestion'
import { Modal, ModalRef } from '@/app/components/Modal'
import { Button } from '@/app/components/Button'
import { DragAndDropQuestion } from './DragAndDropQuestion'
import { CheckboxQuestion } from './CheckboxQuestion'

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

  if (currentQuestion) {
    return (
      <div className=" h-[calc(100vh+120px)] w-full flex justify-center">
        <div className="absolute min-h-[calc(100vh-120px)] mx-auto w-full max-w-2xl mt-12 flex items-center p-6 md:p-0">
          {currentQuestion.content.type === 'selection' && (
            <SelectionQuestion data={currentQuestion.content} />
          )}

          {currentQuestion.content.type === 'open' && (
            <OpenQuestion data={currentQuestion.content} />
          )}

          {currentQuestion.content.type === 'checkbox' && (
            <CheckboxQuestion data={currentQuestion.content} />
          )}

          {currentQuestion.content.type === 'drag-and-drop' && (
            <DragAndDropQuestion data={currentQuestion.content} />
          )}

          {currentQuestion.content.type === 'drag-and-drop-list' && (
            <DragAndDropListQuestion data={currentQuestion.content} />
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
}
