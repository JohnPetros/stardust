'use client'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import { useChallengeCommentsSlot } from './useChallengeCommentsSlot'
import { ChallengeContentNav } from '../../components/ChallengeContentNav'
import { Loading } from '@/ui/global/widgets/components/Loading'

type ChallengeCommentsSlotProps = {
  challengeId: string
}

export function ChallengeCommentsSlot({ challengeId }: ChallengeCommentsSlotProps) {
  const { isVerifyingVisibility, handleCommentListFetch, handleCommentSave } =
    useChallengeCommentsSlot(challengeId)

  if (isVerifyingVisibility) {
    return <Loading isSmall={false} />
  }

  return (
    <>
      <div className='px-6 pt-3'>
        <ChallengeContentNav contents={['description', 'solutions']} />
      </div>
      <CommentsList
        inputPlaceholder='Deixe um comentário sobre esse desafio...'
        emptyListMessage='Esse desafio ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
        onFetchComments={handleCommentListFetch}
        onSaveComment={handleCommentSave}
      />
    </>
  )
}
