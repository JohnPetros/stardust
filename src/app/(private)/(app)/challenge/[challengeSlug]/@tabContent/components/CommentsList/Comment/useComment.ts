import { useRef, useState } from 'react'

import type { Comment } from '@/@types/Comment'

import { AlertDialogRef } from '@/global/components/AlertDialog/types/AlertDialogRef'
import { PopoverMenuButton } from '@/global/components/PopoverMenu'
import { APP_ERRORS } from '@/global/constants'
import { CACHE } from '@/global/constants/cache'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'

import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'

export function useComment(commentId: string) {
  const [shouldFetchCommentReplies, setShouldFetchCommentReplies] =
    useState(false)
  const [canEditComment, setCanEditComment] = useState(false)
  useState(false)
  const [isUserReplyInputVisible, setIsUserReplyInputVisible] = useState(false)
  const [isRepliesVisible, setIsRepliesVisible] = useState(false)

  const api = useApi()
  const alertDialogRef = useRef<AlertDialogRef>(null)

  function checkUserUpvotedReply(
    comment: Comment,
    votedCommentsIds: string[]
  ) {
    const isVoted = votedCommentsIds.includes(comment.id)

    return {
      ...comment,
      isVoted,
    }
  }

  async function getReplies() {
    if (!user) return

    const upvotedCommentsIds = await api.getUserUpvotedCommentsIds(user.id)

    const replies = await api.getCommentReplies(commentId)

    return replies.map((reply) =>
      checkUserUpvotedReply(reply, upvotedCommentsIds)
    )
  }

  const {
    data: replies,
    error,
    isLoading,
    isRefetching,
    refetch: refetchReplies,
  } = useCache({
    key: CACHE.keys.commentReplies,
    fetcher: getReplies,
    dependencies: [commentId],
    isEnabled: shouldFetchCommentReplies,
  })

  const { user } = useAuthContext()
  const toast = useToastContext()

  if (error) throw new Error(APP_ERRORS.comments.failedrepliesFetching)

  async function handlePostUserReply() {
    await refetchReplies()
    setIsRepliesVisible(true)
    setIsUserReplyInputVisible(false)
    if (!shouldFetchCommentReplies) setShouldFetchCommentReplies(true)
  }

  async function handleDeleteUserReply(replyId: string) {
    if (!user) return

    try {
      await api.deleteComment(replyId, user.slug)
      await refetchReplies()
    } catch (error) {
      toast.show(APP_ERRORS.comments.failedReplyDeletion, { type: 'error', seconds: 5 })
    }
  }

  function handleCancelUserReply() {
    setIsUserReplyInputVisible(false)
  }

  function handleCancelCommentEdition() {
    setCanEditComment(false)
  }

  function handleToggleIsUserReplyInputVisible() {
    setIsUserReplyInputVisible(!isUserReplyInputVisible)
  }

  function handleToggleIsRepliesVisible() {
    setIsRepliesVisible(!isRepliesVisible)
    if (!shouldFetchCommentReplies) setShouldFetchCommentReplies(true)
  }

  async function handleEditComment() {
    setCanEditComment(false)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Editar comentário',
      isToggle: false,
      action: () => setCanEditComment(true),
    },
    {
      title: 'Deletar comentário',
      isToggle: false,
      action: () => alertDialogRef.current?.open(),
    },
  ]

  return {
    replies,
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies: isLoading ?? isRefetching,
    popoverMenuButtons,
    canEditComment,
    alertDialogRef,
    handleEditComment,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handlePostUserReply,
    handleDeleteUserReply,
    handleCancelCommentEdition,
    handleCancelUserReply,
  }
}
