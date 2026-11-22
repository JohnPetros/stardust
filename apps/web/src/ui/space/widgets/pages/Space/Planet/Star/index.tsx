'use client'

import type { Id, Name, OrdinalNumber } from '@stardust/core/global/structures'

import { useSpaceContext } from '@/ui/space/hooks/useSpaceContext'
import { StarView } from './StarView'
import { useStar } from './useStar'

type StarProps = {
  id: Id
  planetId: Id
  name: Name
  number: OrdinalNumber
  isChallenge: boolean
  previousStarNumber: number | null
}

export const Star = ({
  id,
  planetId,
  name,
  number,
  isChallenge,
  previousStarNumber,
}: StarProps) => {
  const space = useSpaceContext()
  const star = useStar({ starId: id, planetId, isChallenge, previousStarNumber, space })

  if (!star.hasTrail) return null

  return (
    <StarView
      {...star.view}
      name={name.value}
      number={number.value}
      currentItemRef={space.currentItemRef}
      onSelect={star.handleSelect}
      onClick={star.handleClick}
    />
  )
}
