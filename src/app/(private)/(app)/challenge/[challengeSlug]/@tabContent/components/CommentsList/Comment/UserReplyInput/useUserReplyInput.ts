'use client'

import { useState } from 'react'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { APP_ERRORS } from '@/global/constants'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'

export function useUserReplyInput(
  commentId: string,
  onPostReply: VoidFunction
) {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const { user } = useAuthContext()

  const [reply, setReply] = useState('')

  const api = useApi()
  const toast = useToastContext()

  async function handlePostReply(reply: string) {
    if (!challenge || !user) return

    try {
      await api.postComment(
        {
          challengeId: challenge.id,
          content: reply,
          parentCommentId: commentId,
        },
        user.slug
      )
    } catch (error) {
      console.log(error)
      toast.show(APP_ERRORS.comments.failedReply, { type: 'error', seconds: 5 })
    } finally {
      onPostReply()
    }
  }

  function handleReplyChange(newReply: string) {
    setReply(newReply)
  }

  return {
    reply,
    handlePostReply,
    handleReplyChange,
  }
}
