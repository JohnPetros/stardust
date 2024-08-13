'use client'
import { _listChallenges } from './_listChallenges'
import { ChallengeCard } from './ChallengeCard'
import { useChallengesList } from './useChallengesList'

export function ChallengesList() {
  const { challenges } = useChallengesList(_listChallenges)

  return (
    <div className='mx-auto max-w-2xl px-6 pb-40 md:px-0'>
      <div className='space-y-6'>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} data={challenge} />
        ))}
      </div>
    </div>
  )
}
