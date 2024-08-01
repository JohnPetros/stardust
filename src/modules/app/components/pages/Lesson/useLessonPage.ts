'use client'

import { useEffect, useRef, useState } from 'react'

import type { TextBlockDTO, QuestionDTO, StarRewardingPayloadDTO } from '@/@core/dtos'
import { Quiz, Theory } from '@/@core/domain/structs'
import { useLessonStore } from '@/infra/stores/LessonStore'
import { COOKIES, ROUTES, STORAGE } from '@/modules/global/constants'
import { useLocalStorage } from '@/modules/global/hooks/useLocalStorage'
import { useSecondsCounter } from '@/modules/global/hooks/useSecondsCounter'
import { useRouter } from '@/modules/global/hooks'
import { _setCookie } from '@/modules/global/actions'

export function useLessonPage(
  starId: string,
  questionsDTO: QuestionDTO[],
  textsBlocksDTO: TextBlockDTO[],
) {
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { getStageSlice, getQuizSlice, getTheorySlice, resetStore } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const { stage } = getStageSlice()
  const { setTheory } = getTheorySlice()
  const router = useRouter()
  const secondsCounter = useLocalStorage(STORAGE.keys.secondsCounter)
  useSecondsCounter(stage === 'quiz')

  function handleLeavePage() {
    localStorage.removeItem(STORAGE.keys.secondsCounter)
    resetStore()
    router.goTo(ROUTES.private.app.home.space)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitionVisible(false), 1000)

    setTheory(Theory.create(textsBlocksDTO.slice(0, 2)))
    setQuiz(Quiz.create(questionsDTO))

    return () => {
      clearTimeout(timeout)
    }
  }, [textsBlocksDTO, questionsDTO, setTheory, setQuiz])

  useEffect(() => {
    if (stage === 'rewards') {
      async function goToRewardingPage() {
        if (!quiz) return

        const rewardingPayloadDTO: StarRewardingPayloadDTO = {
          origin: 'star',
          questionsCount: quiz.questionsCount,
          incorrectAnswersCount: quiz.incorrectAnswersCount.value,
          secondsCount: Number(secondsCounter.get()),
          starId: starId,
        }

        await _setCookie(
          COOKIES.keys.rewardingPayload,
          JSON.stringify(rewardingPayloadDTO),
        )
        router.goTo(ROUTES.private.app.rewarding)
      }

      goToRewardingPage()
    }
  }, [stage, quiz, router.goTo, secondsCounter.get, starId])

  return {
    scrollRef,
    stage,
    isTransitionVisible,
    handleLeavePage,
  }
}
