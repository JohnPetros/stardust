'use client'

import { Id, Slug } from '@stardust/core/global/structures'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useRef } from 'react'
import { useStar } from './useStar'
import { useRest } from '@/ui/global/hooks/useRest'
import { StarView } from './StarView'

type StarProps = {
  id: string
  name: string
  slug: string
  number: number
  isUnlocked: boolean
  isLastUnlockedStar: boolean
}

export const Star = ({
  id,
  name,
  number,
  isUnlocked,
  slug,
  isLastUnlockedStar,
}: StarProps) => {
  const { challengingService } = useRest()
  const starAnimationRef = useRef<AnimationRef>(null)
  const { lastUnlockedStarRef, handleStarClick } = useStar({
    starId: Id.create(id),
    starSlug: Slug.create(slug),
    isLastUnlockedStar,
    starAnimationRef,
    challengingService,
  })

  return (
    <StarView
      name={name}
      number={number}
      isUnlocked={isUnlocked}
      isLastUnlockedStar={isLastUnlockedStar}
      lastUnlockedStarRef={lastUnlockedStarRef}
      starAnimationRef={starAnimationRef}
      onClick={handleStarClick}
    />
  )
}
