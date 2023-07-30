'use client'

import { useChallenge } from '@/hooks/useChallenge'
import { Challenge } from './components/Challenge'
import { Selects } from './components/Selects'

export default function Challenges() {
  const { challenges } = useChallenge()

  console.log(challenges)

  return (
    <div className="mx-auto max-w-2xl mt-10">
      <Selects />

      {challenges && (
        <div className="space-y-6 mt-10">
          {challenges.map((challenge) => (
            <Challenge
              key={challenge.id}
              data={challenge}
              isCompleted={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
