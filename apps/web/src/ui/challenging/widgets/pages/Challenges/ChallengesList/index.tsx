'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { ChallengeCardSkeleton } from '../ChallengesList/ChallengeCardSkelleton'
import { ChallengeCard } from './ChallengeCard'
import { useChallengesList } from './useChallengesList'

export function ChallengesList() {
  const { user } = useAuthContext()
  const { challenges, isLoading, isRecheadedEnd, handleShowMore } = useChallengesList()

  if (user)
    return (
      <div className='mx-auto max-w-2xl pb-40'>
        <div className='space-y-6'>
          {isLoading ? (
            <>
              <ChallengeCardSkeleton />
              <ChallengeCardSkeleton />
              <ChallengeCardSkeleton />
              <ChallengeCardSkeleton />
            </>
          ) : (
            <>
              {challenges.length === 0 && (
                <p className='text-center text-gray-50 mt-6'>
                  Nenhum desafio encontrado.
                </p>
              )}
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id.value}
                  title={challenge.title.value}
                  slug={challenge.slug.value}
                  authorSlug={challenge.author.slug.value}
                  authorName={challenge.author.name.value}
                  categories={challenge.categories}
                  difficultyLevel={challenge.difficulty.level}
                  downvotesCount={challenge.downvotesCount.value}
                  completionsCount={challenge.completionsCount.value}
                  upvotesCount={challenge.upvotesCount.value}
                  isCompleted={user.hasCompletedChallenge(challenge.id).isTrue}
                />
              ))}
            </>
          )}

          {!isRecheadedEnd && (
            <ShowMoreButton isLoading={isLoading} onClick={handleShowMore} />
          )}
        </div>
      </div>
    )
}
