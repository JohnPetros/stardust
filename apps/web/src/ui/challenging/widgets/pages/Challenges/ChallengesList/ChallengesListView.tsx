import type { Challenge } from '@stardust/core/challenging/entities'

import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { ChallengeCardSkeleton } from '../ChallengesList/ChallengeCardSkelleton'
import { ChallengeCard } from './ChallengeCard'

type Props = {
  challenges: Challenge[]
  isInitialLoading: boolean
  isLoadingMore: boolean
  isReachedEnd: boolean
  onShowMore: () => void
}

export const ChallengesListView = ({
  challenges,
  isInitialLoading,
  isLoadingMore,
  isReachedEnd,
  onShowMore,
}: Props) => {
  return (
    <div className='mx-auto max-w-2xl pb-40'>
      <div className='space-y-6'>
        {isInitialLoading ? (
          <>
            <ChallengeCardSkeleton />
            <ChallengeCardSkeleton />
            <ChallengeCardSkeleton />
            <ChallengeCardSkeleton />
          </>
        ) : (
          <>
            {challenges.length === 0 && (
              <p className='text-center text-gray-50 mt-6'>Nenhum desafio encontrado.</p>
            )}
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id.value}
                id={challenge.id}
                title={challenge.title.value}
                slug={challenge.slug.value}
                authorSlug={challenge.author.slug.value}
                authorName={challenge.author.name.value}
                categories={challenge.categories}
                difficultyLevel={challenge.difficulty.level}
                downvotesCount={challenge.downvotesCount.value}
                completionCount={challenge.completionCount.value}
                upvotesCount={challenge.upvotesCount.value}
                isNew={challenge.isNew.value}
              />
            ))}
          </>
        )}

        {!isReachedEnd && (
          <ShowMoreButton isLoading={isLoadingMore} onClick={onShowMore} />
        )}
      </div>
    </div>
  )
}
