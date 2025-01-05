'use client'

import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListingParams } from '@stardust/core/forum/types'

import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useSolutionsCommentsList(solutionId: string) {
  const api = useApi()
  const toast = useToastContext()

  async function handleCommentListFetch(params: CommentsListingParams) {
    return await api.fetchChallengeCommentsList(params, solutionId)
  }

  async function handleCommentSave(comment: Comment) {
    const response = await api.saveChallengeComment(comment, solutionId)
    if (response.isFailure) toast.show(response.errorMessage)
  }

  return {
    handleCommentSave,
    handleCommentListFetch,
  }
}
