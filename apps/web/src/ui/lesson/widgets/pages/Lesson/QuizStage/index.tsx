'use client'

import { useRef } from 'react'
import { AnimatePresence } from 'motion/react'

import {
  SelectionQuestion as SelectionQuestionEntity,
  CheckboxQuestion as CheckboxQuestionEntity,
  OpenQuestion as OpenQuestionEntity,
  DragAndDropListQuestion as DragAndDropListQuestionEntity,
  DragAndDropQuestion as DragAndDropQuestionEntity,
} from '@stardust/core/lesson/entities'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { VerificationButton } from '@/ui/global/widgets/components/VerificationButton'
import { QuestionContainer } from './AnimatedQuestionContainer'
import { SelectionQuestion } from './SelectionQuestion'
import { DragAndDropQuestion } from './DragAndDropQuestion'
import { DragAndDropListQuestion } from './DragAndDropListQuestion'
import { OpenQuestion } from './OpenQuestion'
import { useQuizStage } from './useQuizStage'
import { CheckboxQuestion } from './CheckboxQuestion'

type QuizProps = {
  leaveLesson: () => void
}

export function QuizStage({ leaveLesson }: QuizProps) {
  const alertDialogRef = useRef<AlertDialogRef>(null)
  const { quiz, handleVerificationButtonClick } = useQuizStage(alertDialogRef)
  if (!quiz) return

  const question = quiz.currentQuestion

  if (question)
    return (
      <div className='flex flex-col'>
        <div
          key={quiz.currentQuestionIndex.value}
          className='mt-12 flex h-[calc(100vh-8rem)] w-full'
        >
          <AnimatePresence>
            {question instanceof SelectionQuestionEntity && (
              <QuestionContainer id={question.id.value}>
                <SelectionQuestion
                  stem={question.stem.value}
                  options={question.options}
                  code={question.code ?? null}
                  picture={question.picture.value}
                />
              </QuestionContainer>
            )}

            {question instanceof CheckboxQuestionEntity && (
              <QuestionContainer id={question.id.value}>
                <CheckboxQuestion
                  stem={question.stem.value}
                  options={question.options}
                  code={question.code ?? null}
                  picture={question.picture.value}
                />
              </QuestionContainer>
            )}

            {question instanceof OpenQuestionEntity && (
              <QuestionContainer id={question.id.value}>
                <OpenQuestion
                  stem={question.stem.value}
                  answers={question.answers.items}
                  codeLines={question.codeLines}
                  code={question.code ?? null}
                  picture={question.picture.value}
                />
              </QuestionContainer>
            )}

            {question instanceof DragAndDropListQuestionEntity && (
              <QuestionContainer id={question.id.value}>
                <DragAndDropListQuestion
                  preSortableList={question.sortableList}
                  stem={question.stem.value}
                  picture={question.picture.value}
                />
              </QuestionContainer>
            )}

            {question instanceof DragAndDropQuestionEntity && (
              <QuestionContainer id={question.id.value}>
                <DragAndDropQuestion
                  stem={question.stem.value}
                  picture={question.picture.value}
                  codeLines={question.codeLines}
                  dropZoneSlotsCount={question.dropZoneSlotsCount.value}
                  dropZoneSlotsIndexes={question.dropZoneSlotsIndexes}
                  initialDragAndDrop={question.dragAndDrop}
                />
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
            onClick={handleVerificationButtonClick}
            isAnswerCorrect={quiz.userAnswer.isCorrect.isTrue}
            isAnswerVerified={quiz.userAnswer.isVerified.isTrue}
            isAnswered={quiz.userAnswer.isAnswered.isTrue}
          />
        </div>
      </div>
    )
}
