'use client'

import { useState } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'
import { ERRORS } from '@/utils/constants'

export function useUserReplyInput(
  commentId: string,
  onPostReply: VoidFunction
) {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const { user } = useAuth()

  const [reply, setReply] = useState('')

  const api = useApi()
  const toast = useToast()

  async function handlePostReply(reply: string) {
    if (!challenge || !user) return
    console.log('teste')

    try {
      await api.postComment(
        {
          challenge_id: challenge.id,
          content: reply,
          parent_comment_id: commentId,
          created_at: new Date(),
        },
        user.id
      )
    } catch (error) {
      console.log(error)
      toast.show(ERRORS.comments.failedReply, { type: 'error', seconds: 5 })
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
