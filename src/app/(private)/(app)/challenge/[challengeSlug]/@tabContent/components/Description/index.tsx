'use client'

import { BlockedCommentsAlert } from '../../../components/Layout/BlockedCommentsAlert'
import { BlockedSolutionsAlert } from '../../../components/Layout/BlockedSolutionsAlert'
import { ContentLink } from '../../../components/Layout/ContentLink'

import { useDescription } from './useDescription'
import { VoteButtons } from './VoteButtons'

import { ChallengeInfo } from '@/app/components/ChallengeInfo'
import { DifficultyBadge } from '@/app/components/DifficultyBadge'
import { Loading } from '@/app/components/Loading'
import { Mdx } from '@/app/components/Mdx'
import { useChallengeStore } from '@/stores/challengeStore'

export function Description() {
  const canShowComments = useChallengeStore(
    (store) => store.state.canShowComments
  )
  const canShowSolutions = useChallengeStore(
    (store) => store.state.canShowSolutions
  )

  const { mdx, challenge, isLoading, handleShowSolutions } = useDescription()

  return isLoading ? (
    <div className="grid h-full place-content-center">
      <Loading />
    </div>
  ) : (
    <div className="w-full px-6 py-4">
      {challenge && typeof challenge.isCompleted != 'undefined' && (
        <div className="mx-auto flex w-fit flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <ChallengeInfo
            userSlug={challenge.user_slug}
            downvotes={challenge.downvotes}
            isCompleted={challenge.isCompleted}
            upvotes={challenge.upvotes}
            totalCompletitions={challenge.total_completitions}
          />
          <VoteButtons />
          <div className="flex items-center gap-2 md:hidden">
            {!canShowComments ? (
              <BlockedCommentsAlert>
                <ContentLink
                  title="Comentários"
                  contentType="comments"
                  isActive={false}
                  isBlocked={true}
                />
              </BlockedCommentsAlert>
            ) : (
              <ContentLink
                title="Comentários"
                contentType="comments"
                isActive={false}
                isBlocked={false}
              />
            )}
            {!canShowSolutions ? (
              <BlockedSolutionsAlert onShowSolutions={handleShowSolutions}>
                <ContentLink
                  title="Soluções"
                  contentType="solutions"
                  isActive={false}
                  isBlocked={true}
                />
              </BlockedSolutionsAlert>
            ) : (
              <ContentLink
                title="Soluções"
                contentType="solutions"
                isActive={false}
              />
            )}
          </div>
        </div>
      )}
      <div className="mt-6">
        <Mdx>{mdx}</Mdx>
      </div>
    </div>
  )
}
