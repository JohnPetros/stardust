'use client'

import { useEffect, useState } from 'react'

import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useChallengeCommentsSlot(challengeId: string) {
  const api = useApi()
  const router = useRouter()
  const toast = useToastContext()
  const [isVerifyingVisibility, setIsVerifyingVisibility] = useState(true)
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

  async function handleCommentListFetch(params: CommentsListParams) {
    return await api.fetchChallengeCommentsList(params, challengeId)
  }

  async function handleCommentSave(comment: Comment) {
    const response = await api.saveChallengeComment(comment, challengeId)
    if (response.isFailure) toast.show(response.errorMessage)
  }

  useEffect(() => {
    if (!challenge) return

    if (challenge.isCompleted.isFalse) {
      router.goTo(ROUTES.challenging.challenges.challenge(challenge.slug.value))
      return
    }
    setIsVerifyingVisibility(false)
  }, [challenge, router.goTo])

  return {
    isVerifyingVisibility,
    handleCommentSave,
    handleCommentListFetch,
  }
}
