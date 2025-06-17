'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRest } from '@/ui/global/hooks/useRest'
import { useCommentsList } from './useCommentsList'
import { CommentsListView } from './CommentsListView'
import type { CommentsListProps } from './CommentsListProps'

type Props = {
  inputPlaceholder: string
  emptyListMessage: string
} & CommentsListProps

export const CommentsList = ({
  inputPlaceholder,
  emptyListMessage,
  onPostComment,
  onFetchComments,
}: Props) => {
  const { user } = useAuthContext()
  const { forumService } = useRest()
  const {
    isLoading,
    comments,
    sorter,
    order,
    isRecheadedEnd,
    isPopoverMenuOpen,
    popoverMenuButtons,
    nextPage,
    handlePopoverMenuOpenChange,
    handleSendComment,
    handleDeleteComment,
  } = useCommentsList({
    userId: user?.id.value,
    forumService,
    onPostComment,
    onFetchComments,
  })

  if (user)
    return (
      <CommentsListView
        inputPlaceholder={inputPlaceholder}
        emptyListMessage={emptyListMessage}
        userUpvotedCommentIds={user.upvotedCommentsIds}
        userSlug={user.slug.value}
        comments={comments}
        sorter={sorter}
        order={order}
        isLoading={isLoading}
        isRecheadedEnd={isRecheadedEnd}
        isPopoverMenuOpen={isPopoverMenuOpen}
        popoverMenuButtons={popoverMenuButtons}
        onPopoverMenuOpenChange={handlePopoverMenuOpenChange}
        onShowMore={nextPage}
        onSendComment={handleSendComment}
        onDeleteComment={handleDeleteComment}
        onFetchComments={onFetchComments}
        onPostComment={onPostComment}
      />
    )
}
