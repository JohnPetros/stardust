'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Star } from '@/@types/star'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useLessonStore } from '@/stores/lessonStore'
import { ROUTES, STORAGE } from '@/utils/constants'

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
    const interval = setInterval(() => {
      const currentSeconds = Number(localStorage.getItem(STORAGE.secondsCounter)) ?? 0

      console.log({ currentSeconds })

      localStorage.setItem(STORAGE.secondsCounter, String(currentSeconds + 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [localStorage])

  useEffect(() => {
    async function showRewards() {
      console.log('SECONDS', localStorage.getItem(STORAGE.secondsCounter))

      // const rewardsPayload = JSON.stringify({
      //   star: {
      //     seconds: secondsCounterRef.current?.getSeconds(),
      //     incorrectAnswers: incorrectAnswersAmount,
      //     questions: questions.length,
      //     starSlug: star.slug,
      //   },
      // })

      // setCookie(COOKIES.rewardsPayload, rewardsPayload)
      // router.push(ROUTES.private.rewards)
    }

    if (currentStage === 'rewards') {
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
