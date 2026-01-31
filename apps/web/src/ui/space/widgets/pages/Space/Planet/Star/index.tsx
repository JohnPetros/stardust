'use client'

import { Id, Name, OrdinalNumber, Slug } from '@stardust/core/global/structures'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useRef } from 'react'
import { useStar } from './useStar'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { StarView } from './StarView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'

type StarProps = {
  id: Id
  name: Name
  slug: Slug
  number: OrdinalNumber
}

export const Star = ({ id, name, number, slug }: StarProps) => {
  const { challengingService } = useRestContext()
  const { user } = useAuthContext()
  const { lastUnlockedStarId } = useSpaceContext()
  const isLastUnlockedStar = lastUnlockedStarId === id.value
  const starAnimationRef = useRef<AnimationRef>(null)
  const { lastUnlockedStarRef, handleStarClick } = useStar({
    starId: id,
    starSlug: slug,
    isLastUnlockedStar,
    starAnimationRef,
    challengingService,
  })

  if (user)
    return (
      <StarView
        name={name.value}
        number={number.value}
        isUnlocked={user?.hasUnlockedStar(id).isTrue}
        isRecentlyUnlocked={user?.hasRecentlyUnlockedStar(id).isTrue}
        isLastUnlockedStar={isLastUnlockedStar}
        lastUnlockedStarRef={lastUnlockedStarRef}
        starAnimationRef={starAnimationRef}
        onClick={handleStarClick}
      />
    )
}
