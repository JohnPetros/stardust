'use client'
import { useChallengesList } from '@/hooks/useChallengesList'

import { Challenge } from './components/Challenge'
import { Filters } from './components/Filters'
import { Loading } from '@/app/components/Loading'

export default function Challenges() {
  const { challenges, categories } = useChallengesList()

  console.log(challenges)

  return (
    <div className="mx-auto max-w-2xl mt-10 pb-10">
      <Filters categories={categories} />
      
      {challenges ? (
        <>
          <div className="space-y-6">
            {challenges.map((challenge) => (
              <Challenge
                key={challenge.id}
                data={challenge}
                isCompleted={false}
              />
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
