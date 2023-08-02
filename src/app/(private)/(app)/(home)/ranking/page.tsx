'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRanking } from '@/hooks/useRanking'

import { Badge } from './components/Badge'
import { Loading } from '@/app/components/Loading'
import { clearTimeout } from 'timers'
import dayjs from 'dayjs'

const today = dayjs().day()
const sunday = 0
const restDays = today === sunday ? 7 : 7 - today

export default function Ranking() {
  const { user } = useAuth()
  const { ranking: currentRanking, rankings } = useRanking(
    user?.ranking_id,
    true
  )

  const [currentRankingIndex, setCurrentRankingIndex] = useState(0)
  const [isFirstRendering, setIsFirstRendering] = useState(true)

  console.log(rankings)

  useEffect(() => {
    if (currentRanking) {
      const currentRankingIndex = currentRanking.position - 1
      setCurrentRankingIndex(currentRankingIndex)
    }
  }, [])

  useEffect(() => {
    if (!rankings?.length || !isFirstRendering) return

    const timer = setTimeout(() => {
      setIsFirstRendering(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [rankings])

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      {isFirstRendering && <Loading isSmall={false} />}
      <div
        style={{ backgroundImage: 'url("/images/space-background.png")' }}
        className="grid grid-cols-6 p-4 rounded-md"
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

      <div className="flex flex-col items-center justify-center gap-3 mt-6">
        <p className="font-medium text-gray-100 text-center">
          Os 5 primeiros avançam para o próximo ranking
        </p>

        <strong className="text-center text-green-400">
          {restDays + (restDays === 1 ? ' dia' : ' dias')}
        </strong>
      </div>
    </div>
  )
}