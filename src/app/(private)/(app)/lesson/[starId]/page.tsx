'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useStar } from '@/hooks/useStar'

import { Theory } from '../components/Theory'
import { TransitionPageAnimation } from '../../components/TransitionPageAnimation'

import type { Star } from '@/types/star'
import { Header } from '../components/Header'

export default function Lesson() {
  const { starId } = useParams()
  if (!starId) return null

  const { star, getNextStar } = useStar(String(starId))
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)

  useEffect(() => {
    if (star) {
      setTimeout(() => setIsTransitionVisible(false), 2500)
    }
  }, [star])

  return (
    <div>
      <TransitionPageAnimation isVisible={isTransitionVisible} />
      <main className="relative">
        <Header />
        {star && <Theory title={star.name} number={star?.number} />}
      </main>
    </div>
  )
}
