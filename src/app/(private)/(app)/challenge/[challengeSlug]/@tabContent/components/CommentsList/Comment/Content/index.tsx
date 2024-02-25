'use client'

import { UserCommentInput } from '../../UserCommentInput'

import { useContent } from './useContent'

import { Mdx } from '@/global/components/Mdx'

type CommentEditionInputProps = {
  commentId: string
  initialContent: string
  canEditComment: boolean
  onEdit: () => void
  onCancel: () => void
}

export function Content({
  commentId,
  initialContent,
  canEditComment,
  onEdit,
  onCancel,
}: CommentEditionInputProps) {
  const {
    content,
    handleCommentContentChange,
    handleEditComment,
    handleCancelCommentEdition,
  } = useContent(commentId, initialContent, onEdit, onCancel)

  return canEditComment ? (
    <>
      <UserCommentInput
        id={`user-comment-${commentId}-edition`}
        title='Editar'
        placeholder='responda esse usuário...'
        comment={content}
        onCommentChange={handleCommentContentChange}
        onPost={handleEditComment}
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
