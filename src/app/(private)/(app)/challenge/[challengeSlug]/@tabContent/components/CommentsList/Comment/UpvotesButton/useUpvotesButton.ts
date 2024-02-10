'use client'

import { useEffect, useState } from 'react'

import type { UpvotesButtonProps } from '.'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { APP_ERRORS } from '@/utils/constants'

export function useUpvotesButton({
  commentId,
  initialUpvotesCount,
  isCommentUpvoted,
}: UpvotesButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotesCount)
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
        toast.show(APP_ERRORS.comments.failedDesupvoting, {
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
      toast.show(APP_ERRORS.comments.failedUpvoting, {
        type: 'error',
        seconds: 5,
      })
    }
  }

  useEffect(() => {
    setUpvotes(initialUpvotesCount)
    setIsUpvoted(isCommentUpvoted)
  }, [initialUpvotesCount, isCommentUpvoted])

  return {
    upvotes,
    isUpvoted,
    handleToggleUpvoteComment,
  }
}
