import type { Challenge } from '@stardust/core/challenging/entities'
import type { RefObject } from 'react'

import { ChallengeInfo } from '@/ui/challenging/widgets/components/ChallengeInfo'
import { DifficultyBadge } from '@/ui/global/widgets/components/DifficultyBadge'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Mdx } from '@/ui/global/widgets/components/Mdx'
import { ChallengeVoteControl } from './ChallengeVoteControl'
import { ChallengeControl } from './ChallengeControl'
import { ChallengeContentNav } from '../../components/ChallengeContentNav'
import { SelectionActionButtonView } from '@/ui/challenging/widgets/components/SelectionActionButton/SelectionActionButtonView'

type Position = {
  top: number
  left: number
}

type Props = {
  isLoading: boolean
  challenge: Challenge | null
  isUserChallengeAuthor: boolean
  canManageChallenge: boolean
  isManagingAsAdmin: boolean
  isCompleted: boolean
  mdx: string
  contentRef: RefObject<HTMLDivElement | null>
  isAssistantEnabled: boolean
  isSelectionButtonVisible: boolean
  selectionButtonPosition: Position
  onAddTextSelection: () => void
}

export const ChallengeDescriptionSlotView = ({
  isLoading,
  challenge,
  isUserChallengeAuthor,
  canManageChallenge,
  isManagingAsAdmin,
  isCompleted,
  mdx,
  contentRef,
  isAssistantEnabled,
  isSelectionButtonVisible,
  selectionButtonPosition,
  onAddTextSelection,
}: Props) => {
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
          completionCount={challenge.completionCount.value}
        />
        <ChallengeVoteControl />
        <ChallengeContentNav contents={['comments', 'solutions']} />
        {canManageChallenge && (
          <ChallengeControl
            isChallengePublic={challenge.isPublic.value}
            isManagingAsAdmin={isManagingAsAdmin}
          />
        )}
      </div>
      <div ref={contentRef} className='mt-6 pb-6 relative select-text'>
        <Mdx>{mdx}</Mdx>
        {isAssistantEnabled && isSelectionButtonVisible && (
          <SelectionActionButtonView
            label='Adicionar'
            iconName='description'
            position={selectionButtonPosition}
            onClick={onAddTextSelection}
          />
        )}
      </div>
    </div>
  )
}
