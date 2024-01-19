'use client'
import { useEffect, useState } from 'react'

import { Challenge } from '../Challenge'
import { Filters } from '../Filters'

import { useChallengesList } from './useChallengesList'

import { Category } from '@/@types/category'
import { Loading } from '@/app/components/Loading'

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
