import { useRef, useState } from 'react'

import { PopoverMenuButton } from '@/global/components/PopoverMenu'
import { APP_ERRORS } from '@/global/constants'
import { CACHE } from '@/global/constants/cache'
import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'
import { AlertDialogRef } from '@/global/components/AlertDialog/types/AlertDialogRef'

export function useComment(commentId: string) {
  const [shouldFetchCommentReplies, setShouldFetchCommentReplies] =
    useState(false)
  const [canEditComment, setCanEditComment] = useState(false)
  useState(false)
  const [isUserReplyInputVisible, setIsUserReplyInputVisible] = useState(false)
  const [isRepliesVisible, setIsRepliesVisible] = useState(false)

  const api = useApi()
  const alertDialogRef = useRef<AlertDialogRef>(null)

  async function getReplies() {
    return await api.getCommentReplies(commentId)
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

  if (error) throw new Error(APP_ERRORS.comments.failedrepliesFetching)

  async function handlePostUserReply() {
    await refetchReplies()
    setIsRepliesVisible(true)
    setIsUserReplyInputVisible(false)
    if (!shouldFetchCommentReplies) setShouldFetchCommentReplies(true)
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
    handleCancelCommentEdition,
    handleCancelUserReply,
  }
}
