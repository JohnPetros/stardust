'use client'

import { useRef, useState } from 'react'

import { CACHE } from '@/constants'
import { useApi, useCache } from '@/ui/global/hooks'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { AlertDialogRef } from '../../AlertDialog/types'
import type { PopoverMenuButton } from '../../PopoverMenu/types'
import { Comment, type Topic } from '@stardust/core/forum/entities'

export function useComment(commentId: string) {
  const [shouldFetchCommentReplies, setShouldFetchCommentReplies] = useState(false)
  const [canEditComment, setCanEditComment] = useState(false)
  const [isUserReplyInputVisible, setIsUserReplyInputVisible] = useState(false)
  const [isRepliesVisible, setIsRepliesVisible] = useState(false)
  const { user } = useAuthContext()
  const toast = useToastContext()
  const api = useApi()
  const alertDialogRef = useRef<AlertDialogRef>(null)

  async function fetchReplies() {
    const response = await api.fetchCommentReplies(commentId)
    if (response.isFailure) response.throwError()
    return response.body
  }

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refetchReplies,
  } = useCache({
    key: CACHE.keys.commentReplies,
    fetcher: fetchReplies,
    dependencies: [commentId],
    isEnabled: shouldFetchCommentReplies,
  })

  async function handleReplySend(replyContent: string) {
    if (!user) return

    const reply = Comment.create({
      author: {
        id: user.id,
      },
      content: replyContent,
    })

    const response = await api.saveCommentReply(reply, commentId)

    if (response.isFailure) {
      toast.show(response.errorMessage)
      setIsUserReplyInputVisible(false)
      return
    }

    if (response.isSuccess) {
      refetchReplies()
      setIsRepliesVisible(true)
      setIsUserReplyInputVisible(false)
      if (!shouldFetchCommentReplies) setShouldFetchCommentReplies(true)
    }
  }

  async function handleDeleteUserReply(replyId: string) {
    if (!user) return
    const response = await api.deleteComment(replyId)
    if (response.isSuccess) {
      refetchReplies()
      return
    }
    toast.show(response.errorMessage)
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
    replies: data ? data.map(Comment.create) : [],
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies: isLoading ?? isRefetching,
    popoverMenuButtons,
    canEditComment,
    alertDialogRef,
    handleEditComment,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handleReplySend,
    handleDeleteUserReply,
    handleCancelCommentEdition,
    handleCancelUserReply,
  }
}
