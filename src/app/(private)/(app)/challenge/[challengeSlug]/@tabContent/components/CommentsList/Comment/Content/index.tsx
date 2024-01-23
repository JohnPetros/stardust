'use client'

import { UserCommentInput } from '../../UserCommentInput'

import { useContent } from './useContent'

import { Mdx } from '@/app/components/Mdx'

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
  const { content, handleCommentContentChange, handleCancelCommentEdition } =
    useContent(commentId, initialContent, onEdit, onCancel)

  return canEditComment ? (
    <>
      <UserCommentInput
        id={`user-comment-${commentId}-edition`}
        title="Editar"
        placeholder="responda esse usuário..."
        comment={content}
        onCommentChange={handleCommentContentChange}
        onPost={onEdit}
      />
      <button
        className="mt-3 translate-x-6 text-sm text-green-700"
        onClick={handleCancelCommentEdition}
      >
        Cancelar edição
      </button>
    </>
  ) : (
    <div className="text-sm">
      <Mdx>{content}</Mdx>
    </div>
  )
}
