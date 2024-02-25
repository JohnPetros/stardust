'use client'

import { useEffect, useState } from 'react'

import { UpvoteButtonProps } from './types/UpvotesButtonProps'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { APP_ERRORS } from '@/global/constants'
import { useApi } from '@/services/api'

export function useUpvoteButton({
  commentId,
  initialUpvotesCount,
  isCommentUpvoted,
}: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotesCount)
  const [isUpvoted, setIsUpvoted] = useState(isCommentUpvoted)

  const { user } = useAuthContext()
  const api = useApi()
  const toast = useToastContext()

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
        setIsUpvoted(true)
        setUpvotes(upvotes)
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
      setIsUpvoted(false)
      setUpvotes(upvotes)
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
