import { useState } from 'react'

import type { ForumService } from '@stardust/core/forum/interfaces'
import { Comment } from '@stardust/core/forum/entities'
import { Id, ListingOrder, OrdinalNumber } from '@stardust/core/global/structures'
import { CommentsListSorter } from '@stardust/core/forum/structures'

import { CACHE } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import type { PopoverMenuButton } from '../PopoverMenu/types'
import type { CommentsListProps } from './CommentsListProps'

const COMMENTS_PER_PAGE = OrdinalNumber.create(10)

type Params = {
  userId?: string
  forumService: ForumService
} & CommentsListProps

export function useCommentsList({
  userId,
  forumService,
  onFetchComments,
  onPostComment,
}: Params) {
  const [sorter, setSorter] = useState(CommentsListSorter.createAsByDate())
  const [order, setOrder] = useState(ListingOrder.createAsDescending())
  const [isPopoverMenuOpen, setIsPopoverMenuOpen] = useState(false)
  const toast = useToastContext()

  async function fetchComments(page: number) {
    const response = await onFetchComments({
      itemsPerPage: COMMENTS_PER_PAGE,
      page: OrdinalNumber.create(page),
      sorter,
      order,
    })
    if (response.isFailure) {
      toast.show(response.errorMessage)
      response.throwError()
    }

    return response.body
  }

  const { data, isLoading, isRecheadedEnd, refetch, nextPage } = usePaginatedCache({
    key: CACHE.keys.comments,
    itemsPerPage: COMMENTS_PER_PAGE.value,
    fetcher: fetchComments,
    shouldRefetchOnFocus: false,
    isInfinity: true,
    dependencies: [sorter.value, order.value],
  })

  async function handleSendComment(commentContent: string) {
    if (!userId) return
    const comment = Comment.create({
      content: commentContent,
      author: {
        id: userId,
      },
    })

    await onPostComment(comment)
    refetch()
  }

  async function handleDeleteComment(commentId: string) {
    const response = await forumService.deleteComment(Id.create(commentId))

    if (response.isSuccessful) {
      refetch()
      return
    }

    toast.show(response.errorMessage)
  }

  function handlePopoverMenuOpenChange(isOpen: boolean) {
    setIsPopoverMenuOpen(isOpen)
  }

  function handleSortComments(sorter: CommentsListSorter, order: ListingOrder) {
    setSorter(sorter)
    setOrder(order)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Mais recentes',
      isToggle: true,
      value: sorter.isByDate.and(order.isDescending).isTrue,
      action: () =>
        handleSortComments(
          CommentsListSorter.createAsByDate(),
          ListingOrder.createAsDescending(),
        ),
    },
    {
      title: 'Mais antigos',
      isToggle: true,
      value: sorter.isByDate.and(order.isAscending).isTrue,
      action: () =>
        handleSortComments(
          CommentsListSorter.createAsByDate(),
          ListingOrder.createAsAscending(),
        ),
    },
    {
      title: 'Mais votados',
      isToggle: true,
      value: sorter.isByUpvotes.isTrue,
      action: () =>
        handleSortComments(
          CommentsListSorter.createAsByUpvotes(),
          ListingOrder.createAsDescending(),
        ),
    },
  ]

  return {
    isLoading,
    isPopoverMenuOpen,
    sorter,
    order,
    comments: data.map(Comment.create),
    isRecheadedEnd,
    popoverMenuButtons,
    nextPage,
    handlePopoverMenuOpenChange,
    handleSendComment,
    handleDeleteComment,
  }
}
