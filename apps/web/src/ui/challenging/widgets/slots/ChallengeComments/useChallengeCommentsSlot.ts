'use client'

import { useState } from 'react'

import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useChallengeCommentsSlot(challengeId: string) {
  const api = useApi()
  const router = useRouter()
  const toast = useToastContext()
  const [isVerifyingVisibility, setIsVerifyingVisibility] = useState(true)
  const { user } = useAuthContext()
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

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
