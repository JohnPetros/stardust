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

import type { Star } from '@/types/star'

export default function Lesson() {
  const { starId } = useParams()
  if (!starId) return null

  const { star, nextStar } = useStar(String(starId))
  const { state, dispatch } = useLesson()
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => dispatch({ type: 'incrementSecondsAmount' }), 1000)
  }, [state.secondsAmount])

  useEffect(() => {
    if (star && nextStar) {
      dispatch({ type: 'setTexts', payload: star.texts })
      dispatch({ type: 'setQuestions', payload: star.questions })
      setTimeout(() => setIsTransitionVisible(false), 1000)
    }
  }, [star, nextStar])

  return (
    <div>
      <TransitionPageAnimation isVisible={isTransitionVisible} />
      <main ref={scrollRef} className="relative">
        <Header />
        {star && nextStar && (
          <>
            {state.currentStage === 'theory' && (
              <Theory title={star.name} number={star.number} />
            )}
            {state.currentStage === 'quiz' && <Quiz />}
            {state.currentStage === 'end' && (
              <End isAlreadyCompleted={nextStar.isUnlocked} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
