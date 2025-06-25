import type { CommentsListParams } from '@stardust/core/forum/types'
import type { RestResponse, PaginationResponse } from '@stardust/core/global/responses'
import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import type { Comment } from '@stardust/core/forum/entities'

import { CommentsList } from '@/ui/global/widgets/components/CommentsList'
import { ChallengeContentNav } from '../../components/ChallengeContentNav'
import { BlockedContentAlertDialog } from '../../components/BlockedContentMessage'

type Props = {
  onFetchComments: (
    params: CommentsListParams,
  ) => Promise<RestResponse<PaginationResponse<CommentDto>>>
  onPostComment: (comment: Comment) => Promise<RestResponse<CommentDto>>
}

export const ChallengeCommentsSlotView = ({ onFetchComments, onPostComment }: Props) => {
  return (
    <BlockedContentAlertDialog content='comments'>
      <div className='px-6 pt-3'>
        <ChallengeContentNav contents={['description', 'solutions']} />
      </div>
      <CommentsList
        inputPlaceholder='Deixe um comentário sobre esse desafio...'
        emptyListMessage='Esse desafio ainda não tem comentários. Seja a primeira pessoa a comentar 😉.'
        onFetchComments={onFetchComments}
        onPostComment={onPostComment}
      />
    </BlockedContentAlertDialog>
  )
}
