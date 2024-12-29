'use client'

import type { TopicDto } from '@stardust/core/forum/dtos'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import { ContentDialog } from '../../layouts/Challenge/ContentDialog'
import { useChallengeCommentsSlot } from './useChallengeCommentsSlot'

type ChallengeCommentsSlotProps = {
  topicDto: TopicDto
}

export function ChallengeCommentsSlot({ topicDto }: ChallengeCommentsSlotProps) {
  const { isMobile } = useChallengeCommentsSlot()

  if (isMobile)
    return (
      <div className='md:hidden'>
        <ContentDialog contentType='comments'>
          <CommentsList topicDto={topicDto} />
        </ContentDialog>
      </div>
    )

  return <CommentsList topicDto={topicDto} />
}
