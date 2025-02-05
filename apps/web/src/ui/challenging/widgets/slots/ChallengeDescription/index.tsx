'use client'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ChallengeInfo } from '@/ui/challenging/widgets/components/ChallengeInfo'
import { DifficultyBadge } from '@/ui/global/widgets/components/DifficultyBadge'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Mdx } from '@/ui/global/widgets/components/Mdx'
import { VoteControl } from './ChallengeVoteControl'
import { ChallengeControl } from './ChallengeControl'
import { useChallengeDescriptionSlot } from './useChallengeDescriptionSlot'
import { ChallengeContentNav } from '../../components/ChallengeContentNav'

export function ChallengeDescriptionSlot() {
  const { getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const { mdx, isUserChallengeAuthor, isCompleted, challenge, isLoading } =
    useChallengeDescriptionSlot()

  return isLoading || !challenge ? (
    <div className='grid h-full place-content-center'>
      <Loading />
    </div>
  ) : (
    <div className='w-full px-6 py-4'>
      <div className='mx-auto w-fit flex flex-wrap gap-3 '>
        <DifficultyBadge difficultyLevel={challenge.difficulty.level} />
        <ChallengeInfo
          authorName={challenge.author.name.value}
          authorSlug={challenge.author.slug.value}
          downvotes={challenge.downvotesCount.value}
          isCompleted={isCompleted}
          upvotes={challenge.upvotesCount.value}
          completionsCount={challenge.completionsCount.value}
        />
        <VoteControl />
        <ChallengeContentNav contents={['comments', 'solutions']} />
        {isUserChallengeAuthor && (
          <ChallengeControl
            challengeSlug={challenge.slug.value}
            isChallengePublic={challenge.isPublic.value}
          />
        )}
      </div>
      <div className='mt-6 pb-6'>
        <Mdx>{mdx}</Mdx>
      </div>
    </div>
  )
}
