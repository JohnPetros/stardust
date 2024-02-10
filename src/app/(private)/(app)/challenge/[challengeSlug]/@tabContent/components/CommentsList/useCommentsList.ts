'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Comment } from '@/@types/Comment'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { PopoverMenuButton } from '@/global/components/PopoverMenu'
import { APP_ERRORS, ROUTES } from '@/global/constants'
import { CACHE } from '@/global/constants/cache'
import { useApi } from '@/services/api'
import type { Order } from '@/services/api/types/Order'
import { useCache } from '@/services/cache'
import { useChallengeStore } from '@/stores/challengeStore'

type Sorter = 'date' | 'upvotes'

export function useCommentsList(canShowComments: boolean) {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const { user } = useAuthContext()

  const [sorter, setSorter] = useState<Sorter>('date')
  const [order, setOrder] = useState<Order>('descending')
  const [isPopoverMenuOpen, setIsPopoverMenuOpen] = useState(false)
  const [userComment, setUserComment] = useState('')

  const api = useApi()
  const toast = useToastContext()
  const router = useRouter()

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

  async function getFilteredComments() {
    if (!challenge || !user) return

    const filteredComments = await api.getFilteredComments(
      challenge.id,
      sorter,
      order
    )
    const upvotedCommentsIds = await api.getUserUpvotedCommentsIds(user.id)

    return filteredComments.map((comment) =>
      checkUserUpvotedComment(comment, upvotedCommentsIds)
    )
  }

  const {
    data: comments,
    error,
    isLoading,
    refetch,
  } = useCache({
    key: CACHE.keys.comments,
    fetcher: getFilteredComments,
    dependencies: [challenge?.id, user?.id, sorter, order],
  })

  if (error) {
    console.log(error)
    throw new Error(APP_ERRORS.comments.failedlistFetching)
  }

  async function handleDeleteComment(commentId: string) {
    if (!user || !comments) return

    try {
      await api.deleteComment(commentId, user.id)
      refetch()
    } catch (error) {
      console.error(error)
      toast.show(APP_ERRORS.comments.failedDeletion, {
        type: 'error',
        seconds: 5,
      })
    }
  }

  function handleUserCommentChange(userComment: string) {
    setUserComment(userComment)
  }

  async function handlePostComment(userComment: string) {
    if (!challenge || !user || !comments) return

    try {
      await api.postComment(
        {
          challengeId: challenge.id,
          content: userComment,
          parentCommentId: null,
        },
        user.id
      )
      refetch()
    } catch (error) {
      console.error(error)
      toast.show(APP_ERRORS.comments.failedPost, { type: 'error' })
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

  useEffect(() => {
    if (!canShowComments)
      router.push(`${ROUTES.private.challenge}/${challenge?.slug}`)
  }, [canShowComments, router, challenge?.slug])

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
    handleDeleteComment,
  }
}
