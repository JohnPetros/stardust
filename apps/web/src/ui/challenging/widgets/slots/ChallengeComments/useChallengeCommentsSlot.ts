'use client'

import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListingParams } from '@stardust/core/forum/types'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useEffect } from 'react'

export function useChallengeCommentsSlot(challengeId: string) {
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const { goTo } = useRouter()
  const { md: isMobile } = useBreakpoint()
  const api = useApi()
  const toast = useToastContext()

  async function handleCommentListFetch(params: CommentsListingParams) {
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
    isMobile,
    handleCommentSave,
    handleCommentListFetch,
  }
}
