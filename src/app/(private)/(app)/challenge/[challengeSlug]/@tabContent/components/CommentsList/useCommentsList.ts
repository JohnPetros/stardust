'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

import { Comment } from '@/@types/comment'
import { Order } from '@/@types/order'
import { PopoverMenuButton } from '@/app/components/PopoverMenu'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'
import { ERRORS, ROUTES } from '@/utils/constants'

type Sorter = 'date' | 'upvotes'

export function useCommentsList(canShowComments: boolean) {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const { user } = useAuthContext()

  const [sorter, setSorter] = useState<Sorter>('date')
  const [order, setOrder] = useState<Order>('descending')
  const [isPopoverMenuOpen, setIsPopoverMenuOpen] = useState(false)
  const [userComment, setUserComment] = useState('')

  const api = useApi()
  const toast = useToast()
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
    mutate: refetchComments,
  } = useSWR(
    () =>
      `/comments?challenge_id=${challenge?.id}&user_id=${user?.id}&sorter=${sorter}$order=${order}`,
    getFilteredComments
  )

  if (error) {
    console.log(error)
    throw new Error(ERRORS.comments.failedlistFetching)
  }

  async function handleDeleteComment(commentId: string) {
    if (!user) return

    try {
      await api.deleteComment(commentId, user.id)
      refetchComments()
    } catch (error) {
      console.error(error)
      toast.show(ERRORS.comments.failedDeletion, { type: 'error', seconds: 5 })
    }
  }

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
      toast.show(ERRORS.comments.failedPost, { type: 'error' })
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
