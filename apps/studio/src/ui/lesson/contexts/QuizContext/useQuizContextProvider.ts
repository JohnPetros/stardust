import { useCallback, useMemo, useState } from 'react'

import type { Question } from '@stardust/core/lesson/abstracts'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { QuestionType } from '@stardust/core/lesson/types'
import { Image } from '@stardust/core/global/structures'
import { QuestionFactory } from '@stardust/core/lesson/factories'

import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'
import type { QuizContextValue } from './QuizContextValue'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'

export function useQuizContextProvider(questionsDtos: QuestionDto[]) {
  const [questions, setQuestions] = useState<SortableItem<Question>[]>(
    questionsDtos.map((dto, index) => ({
      index,
      value: QuestionFactory.produce(dto),
    })),
  )
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(questions.length)
  const { useCanExecute, useIsFailure, useIsSuccessful } = useActionButtonStore()
  const { setCanExecute } = useCanExecute()
  const { setIsFailure } = useIsFailure()
  const { setIsSuccessful } = useIsSuccessful()

  const enableActionButton = useCallback(() => {
    setIsSuccessful(false)
    setIsFailure(false)
    setCanExecute(true)
  }, [setCanExecute, setIsSuccessful, setIsFailure])

  const value: QuizContextValue = useMemo(() => {
    function addQuestion(questionType: QuestionType) {
      let question: QuestionDto

      switch (questionType) {
        case 'selection':
          question = {
            type: 'selection',
            picture: Image.DEFAULT_IMAGE_NAME,
            stem: '',
            answer: '',
            options: [],
          }
          break
        case 'open':
          question = {
            type: 'open',
            picture: Image.DEFAULT_IMAGE_NAME,
            stem: '',
            answers: [],
            lines: [],
            code: '',
          }
          break
        case 'checkbox':
          question = {
            type: 'checkbox',
            picture: Image.DEFAULT_IMAGE_NAME,
            stem: '',
            options: [],
            correctOptions: [],
            code: '',
          }
          break
        case 'drag-and-drop-list':
          question = {
            type: 'drag-and-drop-list',
            picture: Image.DEFAULT_IMAGE_NAME,
            stem: '',
            items: [],
          }
          break
        case 'drag-and-drop':
          question = {
            type: 'drag-and-drop',
            picture: Image.DEFAULT_IMAGE_NAME,
            stem: '',
            items: [],
            lines: [],
            correctItems: [],
          }
          break
      }
      const newQuestionIndex = questions.length
      setQuestions((questions) => [
        ...questions,
        { index: newQuestionIndex, value: QuestionFactory.produce(question) },
      ])
      selectQuestion(newQuestionIndex)
      enableActionButton()
    }

    function removeQuestion(questionIndex: number) {
      setQuestions((questions) => questions.filter((_, index) => index !== questionIndex))
      enableActionButton()
    }

    function selectQuestion(questionIndex: number) {
      setSelectedQuestionIndex(questionIndex)
    }

    function reorderQuestions(questions: SortableItem<Question>[]) {
      setQuestions(questions)
      enableActionButton()
    }

    return {
      questions,
      selectedQuestionIndex,
      selectQuestion,
      addQuestion,
      removeQuestion,
      reorderQuestions,
    }
  }, [questions, selectedQuestionIndex, enableActionButton])

  return value
}
