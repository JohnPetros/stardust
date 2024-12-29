'use client'

import { useState } from 'react'

import type { ListingOrder } from '@stardust/core/global/types'
import { Comment, type Topic } from '@stardust/core/forum/entities'
import type { CommentsListingSorter } from '@stardust/core/forum/types'

import { CACHE } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import type { PopoverMenuButton } from '../PopoverMenu/types'

const COMMENTS_PER_PAGE = 10

export function useCommentsList(topic: Topic) {
  const [sorter, setSorter] = useState<CommentsListingSorter>('date')
  const [order, setOrder] = useState<ListingOrder>('descending')
  const [isPopoverMenuOpen, setIsPopoverMenuOpen] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const toast = useToastContext()
  const { user } = useAuthContext()
  const api = useApi()

  async function fetchComments(page: number) {
    const response = await api.fetchComments({
      topicId: topic.id,
      itemsPerPage: COMMENTS_PER_PAGE,
      page,
      sorter,
      order,
    })
    if (response.isFailure) {
      toast.show(response.errorMessage)
      response.throwError()
    }

    return response.body.items
  }

  const { data, isLoading, refetch } = usePaginatedCache({
    key: CACHE.keys.comments,
    itemsPerPage: COMMENTS_PER_PAGE,
    fetcher: fetchComments,
    dependencies: [topic.id, sorter, order],
  })

  async function handleSendComment(commentContent: string) {
    if (!user) return

    const comment = Comment.create({
      content: commentContent,
      author: {
        id: user.id,
        name: user.name.value,
        slug: user.slug.value,
        avatar: { name: user.avatar.name.value, image: user.avatar.image.value },
      },
    })

    await api.saveComment(comment, topic)
    refetch()
    setCommentContent('')
  }

  async function handleDeleteComment(commentId: string) {
    const response = await api.deleteComment(commentId)

    if (response.isSuccess) {
      refetch()
    }

    toast.show(response.errorMessage)
  }

  function handleCommentChange(CommentContent: string) {
    setCommentContent(CommentContent)
  }

  function handlePopoverMenuOpenChange(isOpen: boolean) {
    setIsPopoverMenuOpen(isOpen)
  }

  function handleSortComments(sorter: CommentsListingSorter, order: ListingOrder) {
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
    comments: data.map(Comment.create),
    commentContent,
    popoverMenuButtons,
    handlePopoverMenuOpenChange,
    handleCommentChange,
    handleSendComment,
    handleDeleteComment,
  }
}
