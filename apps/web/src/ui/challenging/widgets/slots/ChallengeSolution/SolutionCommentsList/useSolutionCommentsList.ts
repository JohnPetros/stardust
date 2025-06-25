import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'
import type { ForumService } from '@stardust/core/forum/interfaces'
import type { Id } from '@stardust/core/global/structures'

import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useSolutionsCommentsList(solutionId: Id, forumService: ForumService) {
  const toast = useToastContext()

  async function handleFetchComments(params: CommentsListParams) {
    return await forumService.fetchSolutionCommentsList(params, solutionId)
  }

  async function handlePostComment(comment: Comment) {
    const response = await forumService.postSolutionComment(comment, solutionId)
    if (response.isFailure) toast.showError(response.errorMessage)
    return response
  }

  return {
    handlePostComment,
    handleFetchComments,
  }
}
