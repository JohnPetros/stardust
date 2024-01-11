'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useLesson } from '../../useLesson'

import type { Star } from '@/@types/star'
import { useLessonStore } from '@/stores/lessonStore'
import { formatSecondsToTime } from '@/utils/helpers'

export function useLessonStar(star: Star) {
  const { nextStar, updateUserData } = useLesson(star)

  const {
    state: { currentStage, questions, incorrectAnswersAmount, secondsAmount },
    actions: { setTexts, setQuestions, resetState },
  } = useLessonStore()

  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [coins, setCoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [time, setTime] = useState('')
  const [accurance, setAccurance] = useState('')

  const router = useRouter()

  function leaveLesson() {
    router.push('/')
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
    function getAccurance() {
      const accurance =
        ((questions.length - incorrectAnswersAmount) / questions.length) * 100
      return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
    }

    function getCoins() {
      let maxCoins = nextStar && nextStar.isUnlocked ? 5 : 10
      for (let i = 0; i < incorrectAnswersAmount; i++) {
        maxCoins -= nextStar && nextStar.isUnlocked ? 1 : 2
      }
      return maxCoins
    }

    function getXp() {
      let maxXp = nextStar && nextStar.isUnlocked ? 10 : 20
      for (let i = 0; i < incorrectAnswersAmount; i++) {
        maxXp -= nextStar && nextStar.isUnlocked ? 2 : 5
      }

      return maxXp
    }

    if (currentStage === 'congratulations') {
      setXp(getXp())
      setCoins(getCoins())
      setAccurance(getAccurance())
      setTime(formatSecondsToTime(secondsAmount))
    }
  }, [
    currentStage,
    incorrectAnswersAmount,
    nextStar,
    questions.length,
    secondsAmount,
  ])

  return {
    isTransitionVisible,
    scrollRef,
    coins,
    xp,
    time,
    accurance,
    leaveLesson,
    updateUserData,
  }
}
