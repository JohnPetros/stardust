'use client'

import { useChallenge } from '@/hooks/useChallenge'
import { Challenge } from './components/Challenge'

export default function Challenges() {
  const { challenges } = useChallenge()

  console.log(challenges)

  return (
    <div className="mx-auto max-w-2xl mt-10">
      {challenges && (
        <div className="space-y-6">
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
