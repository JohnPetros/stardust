'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { StarRewardsPayload } from '@/@types/Rewards'
import type { Star } from '@/@types/Star'
import { _setCookie } from '@/global/actions/_setCookie'
import { COOKIES, ROUTES, STORAGE } from '@/global/constants'
import { useMdx } from '@/global/hooks/useMdx'
import { useLessonStore } from '@/stores/lessonStore'

export function useLessonStar(star: Star) {
  const { parseTextsToMdxComponents } = useMdx()

  const {
    state: { currentStage, questions, incorrectAnswersCount },
    actions: { setMdxComponentsCount, setQuestions, resetState },
  } = useLessonStore()

  const [mdxComponents, setMdxComponents] = useState<string[]>([])

  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  function leaveLesson() {
    router.push(ROUTES.private.home.space)
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (star) {
      const mdxComponents = parseTextsToMdxComponents(star.texts)
      setMdxComponents(mdxComponents)
      setMdxComponentsCount(star.texts.length)
      setQuestions(star.questions ?? [])
      timeout = setTimeout(() => setIsTransitionVisible(false), 1000)
    }

    return () => {
      localStorage.removeItem(STORAGE.keys.secondsCounter)
      resetState()
      clearTimeout(timeout)
    }
  }, [
    star,
    resetState,
    setMdxComponentsCount,
    setQuestions,
    parseTextsToMdxComponents,
  ])

  useEffect(() => {
    async function showRewards() {
      const currentSeconds = Number(
        localStorage.getItem(STORAGE.keys.secondsCounter)
      )

      const rewardsPayload: StarRewardsPayload = {
        star: {
          seconds: currentSeconds,
          incorrectAnswers: incorrectAnswersCount,
          questions: questions.length,
          starId: star.id,
        },
      }

      await _setCookie(
        COOKIES.keys.rewardsPayload,
        JSON.stringify(rewardsPayload)
      )
      router.push(ROUTES.private.rewards)
    }

    if (currentStage === 'rewards') {
      showRewards()
    }
  }, [currentStage, questions.length, incorrectAnswersCount, router, star.id])

  return {
    isTransitionVisible,
    mdxComponents,
    scrollRef,
    leaveLesson,
  }
}
