'use client'

import { useChallengeStore } from '@/ui/app/stores/ChallengeStore'

export function ChallengeDescriptionPage() {
  const { getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()

  const { mdx, challenge, isLoading, handleShowSolutions } = useDescription()

  return isLoading ? (
    <div className='grid h-full place-content-center'>
      <Loading />
    </div>
  ) : (
    <div className='w-full px-6 py-4'>
      {challenge && typeof challenge.isCompleted != 'undefined' && (
        <div className='mx-auto flex w-fit flex-wrap items-center gap-3'>
          <DifficultyBadge difficulty={challenge.difficulty} />
          <ChallengeInfo
            userSlug={challenge.userSlug}
            downvotes={challenge.downvotesCount}
            isCompleted={challenge.isCompleted}
            upvotes={challenge.upvotesCount}
            totalCompletitions={challenge.totalCompletitions}
          />
          <VoteButtons />
          <div className='flex items-center gap-2 md:hidden'>
            {!canShowComments ? (
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
            {!canShowSolutions ? (
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
      )}
      <div className='mt-6'>
        <Mdx>{mdx}</Mdx>
      </div>
    </div>
  )
}
