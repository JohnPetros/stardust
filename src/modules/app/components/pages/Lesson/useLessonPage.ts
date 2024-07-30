'use client'

import { useEffect, useRef, useState } from 'react'

import type { TextBlockDTO, QuestionDTO } from '@/@core/dtos'
import { useLessonStore } from '@/infra/stores/LessonStore'
import { ROUTES, STORAGE } from '@/modules/global/constants'
import { useLocalStorage } from '@/modules/global/hooks/useLocalStorage'
import { useSecondsCounter } from '@/modules/global/hooks/useSecondsCounter'
import { Quiz, Theory } from '@/@core/domain/structs'
import { useRouter } from '@/modules/global/hooks'

export function useLessonPage(
  questionsDTO: QuestionDTO[],
  textsBlocksDTO: TextBlockDTO[],
) {
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { getStageSlice, getQuizSlice, getTheorySlice, resetStore } = useLessonStore()
  const { stage } = getStageSlice()
  const { setQuiz } = getQuizSlice()
  const { setTheory } = getTheorySlice()
  const { goTo } = useRouter()

  useSecondsCounter(stage === 'quiz')

  function handleLeavePage() {
    localStorage.removeItem(STORAGE.keys.secondsCounter)
    resetStore()
    goTo(ROUTES.private.app.home.space)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitionVisible(false), 1000)

    setTheory(Theory.create(textsBlocksDTO.slice(0, 2)))
    setQuiz(Quiz.create(questionsDTO))

    return () => {
      clearTimeout(timeout)
    }
  }, [textsBlocksDTO, questionsDTO, setTheory, setQuiz])

  return {
    scrollRef,
    stage,
    isTransitionVisible,
    handleLeavePage,
  }
}
