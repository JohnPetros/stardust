'use client'
import { useEffect, useState } from 'react'

import { ChallengeCard } from './ChallengeCard'
import { useChallengesList } from './useChallengesList'

import { Category } from '@/@types/Category'
import { Loading } from '@/global/components/Loading'

type ChallengesList = {
  categories: Category[]
}

export function ChallengesList({ categories }: ChallengesList) {
  const { challenges, isLoading } = useChallengesList(categories)
  const [isFirstRendering, setIsFirstRendering] = useState(true)

  useEffect(() => {
    if (challenges.length && isFirstRendering && !isLoading) {
      setTimeout(() => {
        setIsFirstRendering(false)
      }, 1500)
    }
  }, [challenges, isFirstRendering, isLoading])

  return (
    <div className="mx-auto max-w-2xl px-6 pb-40 md:px-0">
      {isFirstRendering && <Loading isSmall={false} />}

      <div className="space-y-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} data={challenge} />
        ))}
      </div>
    </div>
  )
}
