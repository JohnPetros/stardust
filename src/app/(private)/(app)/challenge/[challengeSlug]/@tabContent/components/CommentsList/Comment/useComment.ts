import { useRef, useState } from 'react'

import { AlertRef } from '@/app/components/Alert'
import { PopoverMenuButton } from '@/app/components/PopoverMenu'
import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'
import { APP_ERRORS } from '@/global/constants'
import { CACHE } from '@/global/constants/cache'

export function useComment(commentId: string) {
  const [shouldFetchCommentReplies, setShouldFetchCommentReplies] =
    useState(false)
  const [canEditComment, setCanEditComment] = useState(false)
  useState(false)
  const [isUserReplyInputVisible, setIsUserReplyInputVisible] = useState(false)
  const [isRepliesVisible, setIsRepliesVisible] = useState(false)

  const api = useApi()
  const alertRef = useRef<AlertRef>(null)

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
      action: () => alertRef.current?.open(),
    },
  ]

  return {
    replies,
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies: isLoading ?? isRefetching,
    popoverMenuButtons,
    canEditComment,
    alertRef,
    handleEditComment,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handlePostUserReply,
    handleCancelCommentEdition,
    handleCancelUserReply,
  }
}
