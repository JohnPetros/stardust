'use client'

import { useEffect, useState } from 'react'

import type { UpvotesButtonProps } from '.'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { ERRORS } from '@/utils/constants'

export function useUpvotesButton({
  commentId,
  initialUpvotes,
  isCommentUpvoted,
}: UpvotesButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [isUpvoted, setIsUpvoted] = useState(isCommentUpvoted)

  const { user } = useAuthContext()
  const api = useApi()
  const toast = useToast()

  async function handleToggleUpvoteComment() {
    if (!user) return

    if (isUpvoted) {
      setIsUpvoted(false)
      setUpvotes(upvotes - 1)
      try {
        await api.removeUpvotedComment(commentId, user.id)
      } catch (error) {
        console.log(error)
        toast.show(ERRORS.commentFailedDesupvoting, {
          type: 'error',
          seconds: 5,
        })
      }

      return
    }

    setIsUpvoted(true)
    setUpvotes(upvotes + 1)
    try {
      await api.addUpvotedComment(commentId, user.id)
    } catch (error) {
      console.log(error)
      toast.show(ERRORS.commentFailedUpvoting, { type: 'error', seconds: 5 })
    }
  }

  useEffect(() => {
    setUpvotes(initialUpvotes)
    setIsUpvoted(isCommentUpvoted)
  }, [initialUpvotes, isCommentUpvoted])

  return {
    upvotes,
    isUpvoted,
    handleToggleUpvoteComment,
  }
}
