'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Star } from '@/@types/star'
import { setCookie } from '@/app/server/actions/setCookie'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useLessonStore } from '@/stores/lessonStore'
import { COOKIES, ROUTES, STORAGE } from '@/utils/constants'

export function useLessonStar(star: Star) {
  const {
    state: { currentStage, questions, incorrectAnswersAmount },
    actions: { setMdxComponentsAmount, setQuestions, resetState },
  } = useLessonStore()

  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const localStorage = useLocalStorage()

  function leaveLesson() {
    router.push(ROUTES.private.home.space)
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (star) {
      setMdxComponentsAmount(star.texts.length)
      setQuestions(star.questions)
      timeout = setTimeout(() => setIsTransitionVisible(false), 1000)
    }

    return () => {
      resetState()
      clearTimeout(timeout)
    }
  }, [star, resetState, setMdxComponentsAmount, setQuestions])

  useEffect(() => {
    if (currentStage !== 'quiz') return

    const interval = setInterval(() => {
      const currentSeconds =
        Number(localStorage.getItem(STORAGE.secondsCounter)) ?? 0

      localStorage.setItem(STORAGE.secondsCounter, String(currentSeconds + 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [currentStage, localStorage])

  useEffect(() => {
    async function showRewards() {
      const currentSeconds = Number(
        localStorage.getItem(STORAGE.secondsCounter)
      )

      const rewardsPayload = JSON.stringify({
        star: {
          seconds: currentSeconds,
          incorrectAnswers: incorrectAnswersAmount,
          questions: questions.length,
          starSlug: star.slug,
        },
      })

      await setCookie(COOKIES.rewardsPayload, rewardsPayload)
      router.push(ROUTES.private.rewards)
    }

    if (currentStage === 'rewards') {
      console.log('oi')
      showRewards()
    }
  }, [
    currentStage,
    questions.length,
    incorrectAnswersAmount,
    router,
    star.slug,
    localStorage,
  ])

  return {
    isTransitionVisible,
    scrollRef,
    leaveLesson,
  }
}
