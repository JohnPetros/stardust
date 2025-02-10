'use client'

import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'

import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useChallengeCommentsSlot(challengeId: string) {
  const api = useApi()
  const toast = useToastContext()

  async function handleCommentListFetch(params: CommentsListParams) {
    return await api.fetchChallengeCommentsList(params, challengeId)
  }

  async function handleCommentSave(comment: Comment) {
    const response = await api.saveChallengeComment(comment, challengeId)
    if (response.isFailure) toast.show(response.errorMessage)
  }

  return {
    handleCommentSave,
    handleCommentListFetch,
  }
}
