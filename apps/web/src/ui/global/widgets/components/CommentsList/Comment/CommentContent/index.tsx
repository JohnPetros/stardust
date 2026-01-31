'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { CommentContentView } from './CommentContentView'
import { useCommentContent } from './useCommentContent'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

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
  const { forumService } = useRestContext()
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
