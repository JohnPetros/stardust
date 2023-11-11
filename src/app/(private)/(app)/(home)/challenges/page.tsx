'use client'
import { useEffect, useState } from 'react'

import { Challenge } from './components/Challenge'
import { Filters } from './components/Filters'

import { Loading } from '@/app/components/Loading'
import { useChallengesList } from '@/hooks/useChallengesList'

export default function Challenges() {
  const { challenges, categories, isLoading } = useChallengesList()
  const [isFirstRendering, setIsFirstRendering] = useState(true)

  useEffect(() => {
    if (challenges.length && isFirstRendering && !isLoading) {
      setTimeout(() => {
        setIsFirstRendering(false)
      }, 1500)
    }
  }, [challenges, isFirstRendering, isLoading])

  return (
    <div className="mx-auto mt-10 max-w-2xl px-6 pb-40 md:px-0">
      {isFirstRendering && <Loading isSmall={false} />}

      <Filters categories={categories} />

      <div className="space-y-6">
        {challenges.map((challenge) => (
          <Challenge key={challenge.id} data={challenge} />
        ))}
      </div>
    </div>
  )
}
