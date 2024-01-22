'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { Comment } from '@/@types/comment'
import { Order } from '@/@types/order'
import { PopoverMenuButton } from '@/app/components/PopoverMenu'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'
import { ERRORS } from '@/utils/constants'

type Sorter = 'date' | 'upvotes'

export function useCommentsList() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const { user } = useAuth()

  const [sorter, setSorter] = useState<Sorter>('date')
  const [order, setOrder] = useState<Order>('ascending')
  const [isPopoverMenuOpen, setIsPopoverMenuOpen] = useState(false)
  const [userComment, setUserComment] = useState('')

  const api = useApi()
  const toast = useToast()

  async function getUserUpvotedCommentsIds() {
    if (!user) return

    return await api.getUserUpvotedCommentsIds(user.id)
  }

  const { data: votedCommentsIds, error: votedCommentsIdsError } = useSWR(
    () => `/user_upvoted_comments_ids?user_id=${user?.id}`,
    getUserUpvotedCommentsIds
  )

  if (votedCommentsIdsError) throw new Error(ERRORS.commentsListFailedFetching)

  async function getFilteredComments() {
    if (!challenge) return

    return await api.getFilteredComments(challenge.id, sorter, order)
  }

  const {
    data: initialComments,
    error,
    isLoading,
    mutate: refetchComments,
  } = useSWR(
    () =>
      `/comments?challenge_id=${challenge?.id}&sorter=${sorter}$order=${order}`,
    getFilteredComments
  )

  if (error) {
    console.log(error)
    throw new Error(ERRORS.commentsListFailedFetching)
  }

  function checkUserUpvotedComment(
    comment: Comment,
    votedCommentsIds: string[]
  ) {
    const isVoted = votedCommentsIds.includes(comment.id)

    return {
      ...comment,
      isVoted,
    }
  }

  const comments: Comment[] = useMemo(() => {
    if (initialComments && votedCommentsIds) {
      return initialComments.map((comment) =>
        checkUserUpvotedComment(comment, votedCommentsIds)
      )
    }

    return []
  }, [initialComments, votedCommentsIds])

  function handleUserCommentChange(userComment: string) {
    setUserComment(userComment)
  }

  async function handlePostComment(userComment: string) {
    if (!challenge || !user) return

    try {
      await api.postComment(
        {
          challenge_id: challenge.id,
          content: userComment,
          parent_comment_id: null,
          created_at: new Date(),
        },
        user.id
      )
      await refetchComments()
    } catch (error) {
      console.error(error)
      toast.show(ERRORS.commentFailedPost, { type: 'error' })
    } finally {
      setUserComment('')
    }
  }

  function handlePopoverMenuOpenChange(isOpen: boolean) {
    setIsPopoverMenuOpen(isOpen)
  }

  function handleSortComments(sorter: Sorter, order: Order) {
    setSorter(sorter)
    setOrder(order)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Mais recentes',
      isToggle: true,
      value: sorter === 'date' && order === 'descending',
      action: () => handleSortComments('date', 'descending'),
    },
    {
      title: 'Mais antigos',
      isToggle: true,
      value: sorter === 'date' && order === 'ascending',
      action: () => handleSortComments('date', 'ascending'),
    },
    {
      title: 'Mais votados',
      isToggle: true,
      value: sorter === 'upvotes',
      action: () => handleSortComments('upvotes', 'descending'),
    },
  ]

  return {
    isLoading,
    isPopoverMenuOpen,
    sorter,
    order,
    comments,
    userComment,
    popoverMenuButtons,
    handlePopoverMenuOpenChange,
    handleUserCommentChange,
    handlePostComment,
  }
}
