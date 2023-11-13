'use client'
import { useRef } from 'react'

import { Badge } from './Badge'

import type { Ranking } from '@/@types/ranking'

interface BadgesListProps {
  rankings: Ranking[]
  currentRanking: Ranking
}

export function BadgesList({ rankings, currentRanking }: BadgesListProps) {
  const badgesListRef = useRef<HTMLDivElement | null>(null)
  const currentRankingIndex = currentRanking.position - 1

  return (
    <div
      ref={badgesListRef}
      style={{ backgroundImage: 'url("/images/space-background.png")' }}
      className="custom-scrollbar relative z-30 grid grid-cols-[repeat(6,140px)] items-center overflow-x-scroll rounded-md p-4 md:justify-center md:gap-2"
    >
      {rankings?.map(({ id, name, image }, index) => (
        <Badge
          key={id}
          name={name}
          image={image}
          index={index}
          currentRankingIndex={currentRankingIndex}
        />
      ))}
    </div>
  )
}
