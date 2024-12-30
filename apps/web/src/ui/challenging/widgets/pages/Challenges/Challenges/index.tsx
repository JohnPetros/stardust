'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { ChallengeCard } from './ChallengeCard'
import { useChallengesList } from './useChallengesList'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'

export function ChallengesList() {
  const { user } = useAuthContext()
  const { challenges, isLoading, isRecheadedEnd, handleShowMore } = useChallengesList()

  if (user)
    return (
      <div className='mx-auto max-w-2xl px-6 pb-40 md:px-0'>
        <div className='space-y-6'>
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title.value}
              slug={challenge.slug.value}
              authorSlug={challenge.authorSlug.value}
              categories={challenge.categories}
              difficultyLevel={challenge.difficulty.level}
              downvotesCount={challenge.downvotesCount.value}
              completionsCount={challenge.completionsCount.value}
              upvotesCount={challenge.upvotesCount.value}
              isCompleted={user.hasCompletedChallenge(challenge.id).isTrue}
            />
          ))}
          {!isRecheadedEnd && (
            <ShowMoreButton isLoading={isLoading} onClick={handleShowMore} />
          )}
        </div>
      </div>
    )
}
