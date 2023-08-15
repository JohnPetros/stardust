'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useLesson } from '@/hooks/useLesson'
import { useStar } from '@/hooks/useStar'

import { TransitionPageAnimation } from '../../components/TransitionPageAnimation'
import { Header } from '../components/Header'
import { Theory } from '../components/Theory'
import { Quiz } from '../components/Quiz'
import { End } from '../components/End'

export default function Lesson() {
  const { starId } = useParams()
  if (!starId) return null

  const { star, nextStar } = useStar(String(starId))
  const {
    state: { currentStage, questions, incorrectAnswersAmount, secondsAmount },
    dispatch,
  } = useLesson()
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [coins, setCoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [time, setTime] = useState('')
  const [accurance, setAccurance] = useState('')

  function formatSecondsToTime(seconds: number) {
    const date = new Date(0)
    date.setSeconds(seconds)
    const time = date.toISOString().substring(14, 19)

    return time
  }

  function getAccurance() {
    const accurance =
      ((questions.length - incorrectAnswersAmount) / questions.length) * 100
    return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
  }

  function getCoins() {
    if (!nextStar) return 0

    let maxCoins = nextStar.isUnlocked ? 5 : 10
    for (let i = 0; i < incorrectAnswersAmount; i++) {
      maxCoins -= nextStar.isUnlocked ? 1 : 2
    }
    return maxCoins
  }

  function getXp() {
    if (!nextStar) return 0

    let maxXp = nextStar.isUnlocked ? 10 : 20
    for (let i = 0; i < incorrectAnswersAmount; i++) {
      maxXp -= nextStar.isUnlocked ? 2 : 5
    }

    return maxXp
  }

  useEffect(() => {
    setTimeout(() => dispatch({ type: 'incrementSecondsAmount' }), 1000)
  }, [secondsAmount])

  useEffect(() => {
    if (star && nextStar) {
      dispatch({ type: 'setTexts', payload: star.texts })
      dispatch({ type: 'setQuestions', payload: star.questions })
      setTimeout(() => setIsTransitionVisible(false), 1000)
    }
  }, [star, nextStar])

  useEffect(() => {
    if (currentStage) {
      setXp(getXp())
      setCoins(getCoins())
      setAccurance(getAccurance())
      setTime(formatSecondsToTime(secondsAmount))
    }
  }, [currentStage])

  return (
    <div>
      <TransitionPageAnimation isVisible={isTransitionVisible} />
      <main ref={scrollRef} className="relative">
        <Header />
        {star && nextStar && (
          <>
            {currentStage === 'theory' && (
              <Theory title={star.name} number={star.number} />
            )}
            {currentStage === 'quiz' && <Quiz />}
            {currentStage === 'end' && (
              <End coins={coins} xp={xp} time={time} accurance={accurance} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
