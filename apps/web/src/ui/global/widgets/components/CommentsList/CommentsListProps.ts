import type { Comment } from '@stardust/core/forum/entities'
import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import type { CommentsListParams } from '@stardust/core/forum/types'
import type { RestResponse, PaginationResponse } from '@stardust/core/global/responses'

export type CommentsListProps = {
  onFetchComments: (
    params: CommentsListParams,
  ) => Promise<RestResponse<PaginationResponse<CommentDto>>>
  onSaveComment: (comment: Comment) => Promise<void>
}
