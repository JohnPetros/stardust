import { useCallback, useMemo, useState } from 'react'

import type { Question } from '@stardust/core/lesson/abstracts'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { QuestionType } from '@stardust/core/lesson/types'
import { Image } from '@stardust/core/global/structures'
import { QuestionFactory } from '@stardust/core/lesson/factories'

import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import type { QuizContextValue } from './QuizContextValue'

export function useQuizContextProvider(questionsDtos: QuestionDto[]) {
  const [questions, setQuestions] = useState<SortableItem<Question>[]>(
    questionsDtos.map((dto) => ({
      id: dto.id as string,
      data: QuestionFactory.produce(dto),
    })),
  )
  const [selectedQuestion, setSelectedQuestion] = useState<SortableItem<Question>>(
    questions[0],
  )
  const { useCanExecute, useIsFailure, useIsSuccessful } = useActionButtonStore()
  const { setCanExecute } = useCanExecute()
  const { setIsFailure } = useIsFailure()
  const { setIsSuccessful } = useIsSuccessful()

  const enableActionButton = useCallback(() => {
    setIsSuccessful(false)
    setIsFailure(false)
    setCanExecute(true)
  }, [setCanExecute, setIsSuccessful, setIsFailure])

  const data: QuizContextValue = useMemo(() => {
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
          }
          break
        case 'checkbox':
          question = {
            type: 'checkbox',
            picture: Image.DEFAULT_IMAGE_NAME,
            stem: '',
            options: [],
            correctOptions: [],
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
      const newQuestionData = QuestionFactory.produce(question)
      const newQuestion = {
        id: newQuestionData.id.value,
        data: newQuestionData,
      }
      setQuestions((questions) => [...questions, newQuestion])
      setSelectedQuestion(newQuestion)
      enableActionButton()
    }

    function removeQuestion(questionId: string) {
      const filteredQuestions = questions
        .filter((question) => question.id !== questionId)
        .map((question) => ({
          id: question.id,
          data: question.data,
        }))
      setQuestions(filteredQuestions)
      setSelectedQuestion(filteredQuestions[0])
      enableActionButton()
    }

    function selectQuestion(questionId: string) {
      const question = questions.find((question) => question.id === questionId)
      if (!question) return
      setSelectedQuestion(question)
    }

    function replaceSelectedQuestion(question: Question) {
      setQuestions((questions) =>
        questions.map((currentQuestion) =>
          currentQuestion.id === selectedQuestion.id
            ? { ...currentQuestion, data: question }
            : currentQuestion,
        ),
      )
      enableActionButton()
    }

    function reorderQuestions(questions: SortableItem<Question>[]) {
      setQuestions(questions)
      enableActionButton()
    }

    return {
      questions,
      selectedQuestion,
      selectQuestion,
      addQuestion,
      replaceSelectedQuestion,
      removeQuestion,
      reorderQuestions,
    }
  }, [questions, selectedQuestion, enableActionButton])

  return data
}
