import type { Challenge } from '@stardust/core/challenging/entities'
import type { IdsList } from '@stardust/core/global/structures'

import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { ChallengeCardSkeleton } from '../ChallengesList/ChallengeCardSkelleton'
import { ChallengeCard } from './ChallengeCard'

type Props = {
  challenges: Challenge[]
  isLoading: boolean
  isRecheadedEnd: boolean
  completedChallengesIds: IdsList
  onShowMore: () => void
}

export const ChallengesListView = ({
  challenges,
  isLoading,
  isRecheadedEnd,
  completedChallengesIds,
  onShowMore,
}: Props) => {
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
              <p className='text-center text-gray-50 mt-6'>Nenhum desafio encontrado.</p>
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
                isCompleted={completedChallengesIds.includes(challenge.id).isTrue}
              />
            ))}
          </>
        )}

        {!isRecheadedEnd && <ShowMoreButton isLoading={isLoading} onClick={onShowMore} />}
      </div>
    </div>
  )
}
