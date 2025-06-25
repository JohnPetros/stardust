import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'
import type { ForumService } from '@stardust/core/forum/interfaces'
import type { Id } from '@stardust/core/global/structures'

import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useChallengeCommentsSlot(forumService: ForumService, challengeId: Id) {
  const toast = useToastContext()

  async function handleCommentListFetch(params: CommentsListParams) {
    return await forumService.fetchChallengeCommentsList(params, challengeId)
  }

  async function handleCommentPost(comment: Comment) {
    const response = await forumService.postChallengeComment(comment, challengeId)
    if (response.isFailure) toast.show(response.errorMessage)
    return response
  }

  return {
    handleCommentPost,
    handleCommentListFetch,
  }
}
