'use client'

import { useEffect, useRef, useState } from 'react'

import type { TextBlockDto } from '@stardust/core/global/dtos'
import type { QuestionDto } from '@stardust/core/lesson/dtos'

import { COOKIES, ROUTES, STORAGE } from '@/constants'
import { useLessonStore } from '@/ui/lesson/stores/LessonStore'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useSecondsCounter } from '@/ui/global/hooks/useSecondsCounter'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { Quiz, Theory } from '@stardust/core/lesson/structs'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import type { StarRewardingPayload } from '@stardust/core/space/types'

export function useLessonPage(
  starId: string,
  questionsDto: QuestionDto[],
  textsBlocksDto: TextBlockDto[],
) {
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const { getStageSlice, getQuizSlice, getTheorySlice, resetStore } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const { stage } = getStageSlice()
  const { setTheory } = getTheorySlice()
  const { setCookie } = useCookieActions()
  const router = useRouter()
  const secondsCounter = useLocalStorage(STORAGE.keys.secondsCounter)
  const scrollRef = useRef<HTMLDivElement>(null)
  useSecondsCounter(stage === 'quiz')

  function handleLeavePage() {
    localStorage.removeItem(STORAGE.keys.secondsCounter)
    resetStore()
    router.goTo(ROUTES.space)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitionVisible(false), 1000)

    setTheory(Theory.create(textsBlocksDto))
    setQuiz(Quiz.create(questionsDto))

    localStorage.removeItem(STORAGE.keys.secondsCounter)

    return () => {
      clearTimeout(timeout)
    }
  }, [textsBlocksDto, questionsDto, setTheory, setQuiz])

  useEffect(() => {
    if (stage === 'rewards') {
      async function goToRewardingPage() {
        if (!quiz) return

        const rewardingPayload: StarRewardingPayload = {
          questionsCount: quiz.questionsCount,
          incorrectAnswersCount: quiz.incorrectAnswersCount.value,
          secondsCount: Number(secondsCounter.get()),
          starId: starId,
        }

        await setCookie({
          key: COOKIES.keys.rewardingPayload,
          value: JSON.stringify(rewardingPayload),
        })
        router.goTo(ROUTES.rewarding.star)
      }

      goToRewardingPage()
    }
  }, [stage, quiz, router.goTo, secondsCounter.get, setCookie, starId])

  return {
    scrollRef,
    stage,
    isTransitionVisible,
    handleLeavePage,
  }
}
