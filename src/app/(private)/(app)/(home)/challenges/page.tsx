'use client'
import { useEffect, useState } from 'react'

import { Challenge } from './components/Challenge'
import { Filters } from './components/Filters'

import { Loading } from '@/app/components/Loading'
import { useChallengesList } from '@/hooks/useChallengesList'

export default function Challenges() {
  const { challenges, categories, isLoading } = useChallengesList()
  const [isFirstRendering, setIsFirstRendering] = useState(
    challenges.length === 0
  )

  useEffect(() => {
    if (challenges.length && isFirstRendering) {
      setTimeout(() => {
        setIsFirstRendering(false)
      }, 1500)
    }
  }, [challenges, isFirstRendering])

  return (
    <div className="mx-auto mt-10 max-w-2xl px-6 pb-10 md:px-0">
      {isFirstRendering && <Loading isSmall={false} />}
      <Filters categories={categories} />

      {!isLoading ? (
        <>
          <div className="space-y-6">
            {challenges.map((challenge) => (
              <Challenge key={challenge.id} data={challenge} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-10 grid place-content-center">
          <Loading isSmall={true} />
        </div>
      )}
    </div>
  )
}
