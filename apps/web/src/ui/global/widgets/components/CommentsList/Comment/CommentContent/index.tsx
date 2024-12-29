'use client'

import { Mdx } from '../../../Mdx'
import { CommentInput } from '../../CommentInput'
import { useCommentContent } from './useCommentContent'

type CommentContentInputProps = {
  commentId: string
  initialContent: string
  canEditComment: boolean
  onEdit: () => void
  onCancel: () => void
}

export function CommentContent({
  commentId,
  initialContent,
  canEditComment,
  onEdit,
  onCancel,
}: CommentContentInputProps) {
  const {
    content,
    handleCommentContentChange,
    handleEditComment,
    handleCancelCommentEdition,
  } = useCommentContent(commentId, initialContent, onEdit, onCancel)

  return canEditComment ? (
    <>
      <CommentInput
        id={`user-comment-${commentId}-edition`}
        title='Editar'
        placeholder='responda esse usuário...'
        content={content}
        onChange={handleCommentContentChange}
        onSend={handleEditComment}
      />
      <button
        type='button'
        className='mt-3 translate-x-6 text-sm text-green-700'
        onClick={handleCancelCommentEdition}
      >
        Cancelar edição
      </button>
    </>
  ) : (
    <div className='text-sm'>
      <Mdx>{content}</Mdx>
    </div>
  )
}
