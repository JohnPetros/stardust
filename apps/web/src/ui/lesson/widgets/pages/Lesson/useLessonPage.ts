'use client'

import { useEffect, useRef, useState } from 'react'

import type { TextBlockDto, QuestionDto, StarRewardingPayloadDto } from '#dtos'
import { Quiz, Theory } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'
import { COOKIES, ROUTES, STORAGE } from '@/ui/global/constants'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useSecondsCounter } from '@/ui/global/hooks/useSecondsCounter'
import { useRouter } from '@/ui/global/hooks'
import { _setCookie } from '@/ui/global/actions'

export function useLessonPage(
  starId: string,
  questionsDto: QuestionDto[],
  textsBlocksDto: TextBlockDto[],
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
