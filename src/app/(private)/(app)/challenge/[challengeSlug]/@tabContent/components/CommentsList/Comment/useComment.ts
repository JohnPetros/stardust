import { useState } from 'react'
import useSWR from 'swr'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'
import { ERRORS } from '@/utils/constants'

export function useComment(commentId: string) {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const { user } = useAuth()

  const [shouldFetchCommentReplies, setShouldFetchCommentReplies] =
    useState(false)
  const [isUserReplyInputVisible, setIsUserReplyInputVisible] = useState(false)
  const [isRepliesVisible, setIsRepliesVisible] = useState(false)
  const [userReply, setUserReply] = useState('')

  const api = useApi()
  const toast = useToast()

  async function getReplies() {
    return await api.getCommentReplies(commentId)
  }

  const {
    data: replies,
    error,
    mutate: refetchReplies,
    isLoading,
    isValidating,
  } = useSWR(
    () => (shouldFetchCommentReplies ? `/replies?comment_id=${commentId}` : ''),
    getReplies
  )

  if (error) throw new Error(ERRORS.repliesFailedFetching)

  async function handlePostUserReply(userReply: string) {
    if (!challenge || !user) return

    try {
      await api.postComment(
        {
          challenge_id: challenge.id,
          content: userReply,
          parent_comment_id: commentId,
          created_at: new Date(),
        },
        user.id
      )

      await refetchReplies()
    } catch (error) {
      console.log(error)
      toast.show('Não foi possível responder o comentário', { type: 'error' })
    } finally {
      setUserReply('')
      setIsRepliesVisible(true)
      setIsUserReplyInputVisible(false)
      if (!shouldFetchCommentReplies) setShouldFetchCommentReplies(true)
    }
  }

  function handleUserReplyChange(userReply: string) {
    setUserReply(userReply)
  }

  function handleToggleIsUserReplyInputVisible() {
    setIsUserReplyInputVisible(!isUserReplyInputVisible)
  }

  function handleToggleIsRepliesVisible() {
    setIsRepliesVisible(!isRepliesVisible)
    if (!shouldFetchCommentReplies) setShouldFetchCommentReplies(true)
  }

  return {
    replies,
    userReply,
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies: isLoading ?? isValidating,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handlePostUserReply,
    handleUserReplyChange,
  }
}
