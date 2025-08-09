import { useMemo, useState } from 'react'

import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { QuestionType } from '@stardust/core/lesson/types'
import { Image } from '@stardust/core/global/structures'

import type { QuizContextValue } from './QuizContextValue'

export function useQuizContextProvider(lessonQuestions: QuestionDto[]) {
  const [questions, setQuestions] = useState<QuestionDto[]>(lessonQuestions)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(questions.length)

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
      setQuestions((questions) => [...questions, question])
    }

    function removeQuestion(questionIndex: number) {
      setQuestions((questions) => questions.filter((_, index) => index !== questionIndex))
    }

    function selectQuestion(questionIndex: number) {
      setSelectedQuestionIndex(questionIndex)
    }

    function reorderQuestions(originQuestionIndex: number, targetQuestionIndex: number) {
      const newQuestions = [...questions]
      const [movedQuestion] = newQuestions.splice(originQuestionIndex, 1)
      newQuestions.splice(targetQuestionIndex, 0, movedQuestion)
    }

    return {
      questions,
      selectedQuestionIndex,
      selectQuestion,
      addQuestion,
      removeQuestion,
      reorderQuestions,
    }
  }, [questions, selectedQuestionIndex])

  return value
}
