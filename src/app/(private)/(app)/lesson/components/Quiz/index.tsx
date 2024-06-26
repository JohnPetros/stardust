'use client'

import { AnimatePresence } from 'framer-motion'

import { CheckboxQuestion } from './CheckboxQuestion'
import { DragAndDropListQuestion } from './DragAndDropListQuestion'
import { DragAndDropQuestion } from './DragAndDropQuestion'
import { OpenQuestion } from './OpenQuestion'
import { QuestionContainer } from './QuestionContainer'
import { SelectionQuestion } from './SelectionQuestion'
import { VerificationButton } from './VerificationButton'
import { useQuiz } from './useQuiz'

import { AlertDialog } from '@/global/components/AlertDialog'
import { Button } from '@/global/components/Button'
import { useLessonStore } from '@/stores/lessonStore'

type QuizProps = {
  leaveLesson: () => void
}

export function Quiz({ leaveLesson }: QuizProps) {
  const {
    answerHandler,
    isAnswerVerified,
    isAnswerCorrect,
    isAnswered,
    currentQuestionIndex,
  } = useLessonStore((store) => store.state)
  const { alertDialogRef, currentQuestion } = useQuiz()

  if (currentQuestion) {
    return (
      <div className='flex flex-col'>
        <div
          key={currentQuestionIndex}
          className='mt-12 flex h-[calc(100vh-8rem)] w-full overflow-auto'
        >
          <AnimatePresence>
            {currentQuestion.content.type === 'selection' &&
              currentQuestion.index === currentQuestionIndex && (
                <QuestionContainer id={currentQuestion.order}>
                  <SelectionQuestion data={currentQuestion.content} />
                </QuestionContainer>
              )}

            {currentQuestion.content.type === 'open' &&
              currentQuestion.index === currentQuestionIndex && (
                <QuestionContainer id={currentQuestion.order}>
                  <OpenQuestion data={currentQuestion.content} />
                </QuestionContainer>
              )}

            {currentQuestion.content.type === 'checkbox' &&
              currentQuestion.index === currentQuestionIndex && (
                <QuestionContainer id={currentQuestion.order}>
                  <CheckboxQuestion data={currentQuestion.content} />
                </QuestionContainer>
              )}

            {currentQuestion.content.type === 'drag-and-drop' &&
              currentQuestion.index === currentQuestionIndex && (
                <QuestionContainer id={currentQuestion.order}>
                  <DragAndDropQuestion data={currentQuestion.content} />
                </QuestionContainer>
              )}

            {currentQuestion.content.type === 'drag-and-drop-list' &&
              currentQuestion.index === currentQuestionIndex && (
                <QuestionContainer id={currentQuestion.order}>
                  <DragAndDropListQuestion data={currentQuestion.content} />
                </QuestionContainer>
              )}
          </AnimatePresence>

          <AlertDialog
            ref={alertDialogRef}
            type='crying'
            title='Puxa, parece que você não tem mais vidas!'
            body={
              <p className='mt-3 text-center font-medium text-green-400'>
                Mais sorte da próxima vez 😢
              </p>
            }
            action={
              <Button className='w-32 bg-red-700 text-gray-100' onClick={leaveLesson}>
                Sair
              </Button>
            }
          />

          <VerificationButton
            answerHandler={answerHandler}
            isAnswerCorrect={isAnswerCorrect}
            isAnswerVerified={isAnswerVerified}
            isAnswered={isAnswered}
          />
        </div>
      </div>
    )
  }
}
