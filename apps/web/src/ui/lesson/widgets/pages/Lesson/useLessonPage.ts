'use client'

import { useEffect, useRef, useState } from 'react'

import type { TextBlockDto } from '@stardust/core/global/dtos'
import type { QuestionDto, StarRewardingPayloadDto } from '@stardust/core/lesson/dtos'

import { COOKIES, ROUTES, STORAGE } from '@/constants'
import { useLessonStore } from '@/ui/lesson/stores/LessonStore'
import { useLocalStorage, useSecondsCounter } from '@/ui/global/hooks'
import { useRouter } from '@/ui/global/hooks'
import { _setCookie } from '@/ui/global/actions'
import { Quiz, Theory } from '@stardust/core/lesson/structs'

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
  const router = useRouter()
  const secondsCounter = useLocalStorage(STORAGE.keys.secondsCounter)
  const scrollRef = useRef<HTMLDivElement>(null)
  useSecondsCounter(stage === 'quiz')

  function handleLeavePage() {
    localStorage.removeItem(STORAGE.keys.secondsCounter)
    resetStore()
    router.goTo(ROUTES.private.space)
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

        const rewardingPayloadDto: StarRewardingPayloadDto = {
          origin: 'star',
          questionsCount: quiz.questionsCount,
          incorrectAnswersCount: quiz.incorrectAnswersCount.value,
          secondsCount: Number(secondsCounter.get()),
          starId: starId,
        }

        await _setCookie(
          COOKIES.keys.rewardingPayload,
          JSON.stringify(rewardingPayloadDto),
        )
        router.goTo(ROUTES.private.rewarding)
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
