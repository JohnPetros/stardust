'use client'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ChallengeInfo } from '@/ui/challenging/widgets/components/ChallengeInfo'
import { DifficultyBadge } from '@/ui/global/widgets/components/DifficultyBadge'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { ContentLink } from '@/ui/challenging/widgets/components/ContentLink'
import { BlockedCommentsAlertDialog } from '@/ui/challenging/widgets/components/BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '@/ui/challenging/widgets/components/BlockedSolutionsAlertDialog'
import { Mdx } from '@/ui/global/widgets/components/Mdx'
import { VoteControl } from './VoteControl'
import { useChallengeDescriptionSlot } from './useChallengeDescriptionSlot'

export function ChallengeDescriptionSlot() {
  const { getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const { mdx, user, challenge, isLoading, handleShowSolutions } =
    useChallengeDescriptionSlot()

  return isLoading || !challenge || !user ? (
    <div className='grid h-full place-content-center'>
      <Loading />
    </div>
  ) : (
    <div className='w-full px-6 py-4'>
      <div className='mx-auto w-fit flex flex-wrap gap-3 '>
        <DifficultyBadge difficultyLevel={challenge.difficulty.level} />
        <ChallengeInfo
          authorSlug={challenge.authorSlug.value}
          downvotes={challenge.downvotesCount.value}
          isCompleted={user?.hasCompletedChallenge(challenge.id).value}
          upvotes={challenge.upvotesCount.value}
          completionsCount={challenge.completionsCount.value}
        />
        <VoteControl />
        <div className='flex items-center gap-2 md:hidden'>
          {craftsVislibility.canShowSolutions.isFalse ? (
            <BlockedCommentsAlertDialog>
              <ContentLink
                title='Comentários'
                contentType='comments'
                isActive={false}
                isBlocked={true}
              />
            </BlockedCommentsAlertDialog>
          ) : (
            <ContentLink
              title='Comentários'
              contentType='comments'
              isActive={false}
              isBlocked={false}
            />
          )}
          {craftsVislibility.canShowSolutions.isFalse ? (
            <BlockedSolutionsAlertDialog onShowSolutions={handleShowSolutions}>
              <ContentLink
                title='Soluções'
                contentType='solutions'
                isActive={false}
                isBlocked={true}
              />
            </BlockedSolutionsAlertDialog>
          ) : (
            <ContentLink title='Soluções' contentType='solutions' isActive={false} />
          )}
        </div>
      </div>
      <div className='mt-6'>
        <Mdx>{mdx}</Mdx>
      </div>
    </div>
  )
}
