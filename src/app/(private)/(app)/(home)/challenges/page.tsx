'use client'
import { useEffect, useState } from 'react'
import { useChallengesList } from '@/hooks/useChallengesList'

import { Challenge } from './components/Challenge'
import { Filters } from './components/Filters'
import { Loading } from '@/app/components/Loading'

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
  }, [challenges])

  return (
    <div className="mx-auto max-w-2xl mt-10 px-6 md:px-0 pb-10">
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
        <div className="grid place-content-center mt-10">
          <Loading isSmall={true} />
        </div>
      )}
    </div>
  )
}
