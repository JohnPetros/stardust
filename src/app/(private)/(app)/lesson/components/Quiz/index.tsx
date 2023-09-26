'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { Modal, ModalRef } from '@/app/components/Modal'
import { Button } from '@/app/components/Button'
import { SelectionQuestion } from './SelectionQuestion'
import { VerificationButton } from './VerificationButton'
import { DragAndDropListQuestion } from './DragAndDropListQuestion'
import { OpenQuestion } from './OpenQuestion'
import { DragAndDropQuestion } from './DragAndDropQuestion'
import { CheckboxQuestion } from './CheckboxQuestion'
import { AnimatePresence } from 'framer-motion'
import { QuestionContainer } from './QuestionContainer'

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
      <div className="w-full h-[90vh] flex justify-center items-center">
        <AnimatePresence>
          {currentQuestion.content.type === 'selection' && (
            <QuestionContainer id={currentQuestion.order}>
              <SelectionQuestion data={currentQuestion.content} />
            </QuestionContainer>
          )}

          {currentQuestion.content.type === 'open' && (
            <OpenQuestion data={currentQuestion.content} />
          )}

          {currentQuestion.content.type === 'checkbox' && (
            <QuestionContainer id={currentQuestion.order}>
              <CheckboxQuestion data={currentQuestion.content} />
            </QuestionContainer>
          )}

          {currentQuestion.content.type === 'drag-and-drop' && (
            <DragAndDropQuestion data={currentQuestion.content} />
          )}

          {currentQuestion.content.type === 'drag-and-drop-list' && (
            <DragAndDropListQuestion data={currentQuestion.content} />
          )}
        </AnimatePresence>

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
