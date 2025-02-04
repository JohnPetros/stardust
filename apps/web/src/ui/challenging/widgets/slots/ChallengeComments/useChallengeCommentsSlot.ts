'use client'

import { useEffect } from 'react'

import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useChallengeCommentsSlot(challengeId: string) {
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const { goTo } = useRouter()
  const api = useApi()
  const toast = useToastContext()

  async function handleCommentListFetch(params: CommentsListParams) {
    return await api.fetchChallengeCommentsList(params, challengeId)
  }

  async function handleCommentSave(comment: Comment) {
    const response = await api.saveChallengeComment(comment, challengeId)
    if (response.isFailure) toast.show(response.errorMessage)
  }

  useEffect(() => {
    if (craftsVislibility.canShowComments.isFalse)
      goTo(`${ROUTES.challenging.challenges}/${challenge?.slug.value}`)
  }, [goTo, craftsVislibility, challenge?.slug])

  return {
    handleCommentSave,
    handleCommentListFetch,
  }
}
