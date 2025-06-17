'use client'

import { Mdx } from '../../../Mdx'
import { CommentInput } from '../../CommentInput'

type Props = {
  commentId: string
  initialContent: string
  canEditComment: boolean
  content: string
  onEdit: (newCommentContent: string) => void
  onEditionCancel: () => void
}

export const CommentContentView = ({
  commentId,
  initialContent,
  canEditComment,
  content,
  onEdit,
  onEditionCancel,
}: Props) => {
  return canEditComment ? (
    <>
      <CommentInput
        id={`user-comment-${commentId}-edition`}
        title='Editar'
        defaultContent={initialContent}
        onSend={onEdit}
      />
      <button
        type='button'
        className='mt-3 translate-x-6 text-sm text-green-700'
        onClick={onEditionCancel}
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
