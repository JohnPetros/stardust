'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { CommentContentView } from './CommentContentView'
import { useCommentContent } from './useCommentContent'
import { useRest } from '@/ui/global/hooks/useRest'

type Props = {
  commentId: string
  initialContent: string
  canEditComment: boolean
  onEdit: () => void
  onCancel: () => void
}

export const CommentContent = ({
  commentId,
  initialContent,
  canEditComment,
  onEdit,
  onCancel,
}: Props) => {
  const { forumService } = useRest()
  const { content, handleEditComment, handleCancelCommentEdition } = useCommentContent({
    forumService,
    commentId,
    initialContent,
    onEdit: () => onEdit(),
    onEditionCancel: () => onCancel(),
  })

  return (
    <CommentContentView
      commentId={commentId}
      initialContent={initialContent}
      canEditComment={canEditComment}
      content={content}
      onEdit={handleEditComment}
      onEditionCancel={handleCancelCommentEdition}
    />
  )
}
