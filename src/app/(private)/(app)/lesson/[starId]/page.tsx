'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useStar } from '@/hooks/useStar'

import { Theory } from '../components/Theory'
import { TransitionPageAnimation } from '../../components/TransitionPageAnimation'
import { Header } from '../components/Header'

import type { Star } from '@/types/star'

export default function Lesson() {
  const { starId } = useParams()
  if (!starId) return null

  const { star, getNextStar } = useStar(String(starId))
  const [isTransitionVisible, setIsTransitionVisible] = useState(true)

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
