'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Star } from '@/@types/star'
import { setCookie } from '@/app/server/actions/setCookie'
import { useLessonStore } from '@/stores/lessonStore'
import { COOKIES, ROUTES } from '@/utils/constants'

export function useLessonStar(star: Star) {
  const {
    state: { currentStage, questions, incorrectAnswersAmount, secondsAmount },
    actions: { setTexts, setQuestions, resetState },
  } = useLessonStore()

  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const showRewards = useCallback(async () => {
    const rewardsPayload = JSON.stringify({
      star: {
        seconds: secondsAmount,
        incorrectAnswers: incorrectAnswersAmount,
        questions: questions.length,
        starSlug: star.slug,
      },
    })

    await Promise.all([setCookie(COOKIES.rewardsPayload, rewardsPayload)])

    router.push('/congratulations')
  }, [
    router,
    secondsAmount,
    incorrectAnswersAmount,
    questions.length,
    star.slug,
  ])

  function leaveLesson() {
    router.push(ROUTES.private.home)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (star) {
      setTexts(star.texts)
      setQuestions(star.questions)
      timer = setTimeout(() => setIsTransitionVisible(false), 1000)
    }

    return () => {
      resetState()
      clearTimeout(timer)
    }
  }, [star, resetState, setTexts, setQuestions])

  useEffect(() => {
    if (currentStage === 'congratulations') {
      showRewards()
    }
  }, [currentStage, showRewards])

  return {
    isTransitionVisible,
    scrollRef,
    leaveLesson,
  }
}
