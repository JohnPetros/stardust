import { useRef, useState } from 'react'
import useSWR from 'swr'

import { AlertRef } from '@/app/components/Alert'
import { PopoverMenuButton } from '@/app/components/PopoverMenu'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'
import { ERRORS } from '@/utils/constants'

export function useComment(commentId: string, initialContent: string) {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const { user } = useAuth()

  const [shouldFetchCommentReplies, setShouldFetchCommentReplies] =
    useState(false)
  const [canEditComment, setCanEditComment] = useState(false)
  useState(false)
  const [isUserReplyInputVisible, setIsUserReplyInputVisible] = useState(false)
  const [isRepliesVisible, setIsRepliesVisible] = useState(false)
  const [commentContent, setCommentContent] = useState(initialContent)
  const [userReply, setUserReply] = useState('')

  const api = useApi()
  const toast = useToast()
  const alertRef = useRef<AlertRef>(null)

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

  function handleCancelCommentEdition() {
    setCommentContent(initialContent)
    setCanEditComment(false)
  }

  function handleCommentContentChange(content: string) {
    setCommentContent(content)
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

  async function handleEditComment(newContent: string) {
    if (!user) return

    try {
      await api.editComment(commentId, user.id, newContent)
      setCanEditComment(false)
      setCommentContent(newContent)
    } catch (error) {
      console.error(error)
      toast.show(ERRORS.commentFailedEdition, { type: 'error', seconds: 5 })
      handleCancelCommentEdition()
    }
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
    userReply,
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies: isLoading ?? isValidating,
    popoverMenuButtons,
    commentContent,
    canEditComment,
    alertRef,
    handleEditComment,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handlePostUserReply,
    handleUserReplyChange,
    handleCommentContentChange,
    handleCancelCommentEdition,
  }
}
