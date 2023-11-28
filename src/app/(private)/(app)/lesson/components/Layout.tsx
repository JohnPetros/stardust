'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PageTransitionAnimation } from '../../../../components/PageTransitionAnimation'

import { End } from './End'
import { Header } from './Header'
import { Quiz } from './Quiz'
import SecondsIncrementer from './SecondsCounter'
import { Theory } from './Theory'

import type { Star } from '@/@types/star'
import { Alert, AlertRef } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { useStar } from '@/hooks/useStar'
import { useLessonStore } from '@/stores/lessonStore'
import { formatSecondsToTime } from '@/utils/helpers'

interface LayoutProps {
  star: Star
}

export function Layout({ star }: LayoutProps) {
  const { nextStar, updateUserData } = useStar(star)

  const {
    state: { currentStage, questions, incorrectAnswersAmount, secondsAmount },
    actions: { setTexts, setQuestions, resetState },
  } = useLessonStore()

  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const alertRef = useRef<AlertRef>(null)

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

    if (currentStage === 'end') {
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

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      {currentStage !== 'end' && <SecondsIncrementer />}
      <main ref={scrollRef} className="relative overflow-x-hidden">
        {currentStage !== 'end' && <Header onLeaveLesson={leaveLesson} />}

        {star && nextStar && (
          <>
            {currentStage === 'theory' && (
              <Theory title={star.name} number={star.number} />
            )}
            {currentStage === 'quiz' && <Quiz leaveLesson={leaveLesson} />}
            {currentStage === 'end' && (
              <End
                coins={coins}
                xp={xp}
                time={time}
                accurance={accurance}
                userDataUpdater={updateUserData}
                onExit={leaveLesson}
              />
            )}
          </>
        )}
      </main>
    </>
  )
}
