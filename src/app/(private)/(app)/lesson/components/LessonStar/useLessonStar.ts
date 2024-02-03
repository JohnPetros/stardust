'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { StarRewardsPayload } from '@/@types/rewards'
import type { Star } from '@/@types/star'
import { setCookie } from '@/app/server/actions/setCookie'
import { useMdx } from '@/hooks/useMdx'
import { useLessonStore } from '@/stores/lessonStore'
import { COOKIES, ROUTES, STORAGE } from '@/utils/constants'

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
      setQuestions(star.questions)
      timeout = setTimeout(() => setIsTransitionVisible(false), 1000)
    }

    return () => {
      localStorage.removeItem(STORAGE.secondsCounter)
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
        localStorage.getItem(STORAGE.secondsCounter)
      )

      const rewardsPayload: StarRewardsPayload = {
        star: {
          seconds: currentSeconds,
          incorrectAnswers: incorrectAnswersCount,
          questions: questions.length,
          starId: star.id,
        },
      }

      await setCookie(COOKIES.rewardsPayload, JSON.stringify(rewardsPayload))
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
