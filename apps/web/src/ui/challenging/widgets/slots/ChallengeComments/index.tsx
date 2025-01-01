'use client'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import { ContentDialog } from '../../components/ContentDialog'
import { useChallengeCommentsSlot } from './useChallengeCommentsSlot'

type ChallengeCommentsSlotProps = {
  challengeId: string
}

export function ChallengeCommentsSlot({ challengeId }: ChallengeCommentsSlotProps) {
  const { isMobile, handleCommentListFetch, handleCommentSave } =
    useChallengeCommentsSlot(challengeId)

  if (isMobile)
    return (
      <div className='md:hidden'>
        <ContentDialog contentType='comments'>
          <CommentsList
            inputPlaceholder='Deixe um comentário sobre esse desafio...'
            emptyListMessage='Esse desafio ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
            onFetchComments={handleCommentListFetch}
            onSaveComment={handleCommentSave}
          />
        </ContentDialog>
      </div>
    )

  return (
    <CommentsList
      inputPlaceholder='Deixe um comentário sobre esse desafio...'
      emptyListMessage='Esse desafio ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
      onFetchComments={handleCommentListFetch}
      onSaveComment={handleCommentSave}
    />
  )
}
