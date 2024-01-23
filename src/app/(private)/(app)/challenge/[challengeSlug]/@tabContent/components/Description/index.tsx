'use client'

import { useDescription } from './useDescription'
import { VoteButtons } from './VoteButtons'

import { ChallengeInfo } from '@/app/components/ChallengeInfo'
import { DifficultyBadge } from '@/app/components/DifficultyBadge'
import { Loading } from '@/app/components/Loading'
import { Mdx } from '@/app/components/Mdx'

export function Description() {
  const { mdx, challenge, isLoading } = useDescription()

  return isLoading ? (
    <div className="grid h-full place-content-center">
      <Loading />
    </div>
  ) : (
    <div className="px-6 py-4">
      {challenge && typeof challenge.isCompleted != 'undefined' && (
        <div className="flex w-full items-center gap-3">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <ChallengeInfo
            userSlug={challenge.user_slug}
            downvotes={challenge.downvotes}
            isCompleted={challenge.isCompleted}
            upvotes={challenge.upvotes}
            totalCompletitions={challenge.total_completitions}
          />
          <VoteButtons />
        </div>
      )}
      <div className="prose prose-invert mt-6 space-y-12">
        <Mdx>{mdx}</Mdx>
      </div>
    </div>
  )
}
