'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRanking } from '@/hooks/useRanking'

import { Badge } from './components/Badge'

export default function Ranking() {
  const { user } = useAuth()
  const { ranking: currentRanking, rankings } = useRanking(
    user?.ranking_id,
    true
  )

  const [currentRankingIndex, setCurrentRankingIndex] = useState(0)

  console.log(rankings)

  useEffect(() => {
    if (currentRanking) {
      const currentRankingIndex = currentRanking.position - 1
      setCurrentRankingIndex(currentRankingIndex)
    }
  }, [])

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <div
        style={{ backgroundImage: 'url("/images/space-background.png")' }}
        className="grid grid-cols-6 p-6 rounded-md"
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
    </div>
  )
}
