'use client'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { ChallengeContentNav } from '../../components/ChallengeContentNav'
import { BlockedContentAlertDialog } from '../../components/BlockedContentMessage'
import { useChallengeCommentsSlot } from './useChallengeCommentsSlot'

type ChallengeCommentsSlotProps = {
  challengeId: string
}

export function ChallengeCommentsSlot({ challengeId }: ChallengeCommentsSlotProps) {
  const { handleCommentListFetch, handleCommentSave } =
    useChallengeCommentsSlot(challengeId)

  return (
    <BlockedContentAlertDialog content='comments'>
      <div className='px-6 pt-3'>
        <ChallengeContentNav contents={['description', 'solutions']} />
      </div>
      <CommentsList
        inputPlaceholder='Deixe um comentário sobre esse desafio...'
        emptyListMessage='Esse desafio ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
        onFetchComments={handleCommentListFetch}
        onSaveComment={handleCommentSave}
      />
    </BlockedContentAlertDialog>
  )
}
