'use client'
import { useRef, useEffect } from 'react'
import { Badge } from './Badge'
import type { Ranking } from '@/types/ranking'

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
      className="relative grid grid-cols-[repeat(6,140px)] md:gap-2 items-center md:justify-center rounded-md overflow-x-scroll custom-scrollbar p-4 z-30"
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
