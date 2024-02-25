import { UserCommentInput } from '../../UserCommentInput'

import { useUserReplyInput } from './useUserReplyInput'

type UserReplyProps = {
  commentId: string
  onPostReply: () => void
  onCancel: () => void
}

export function UserReplyInput({ commentId, onPostReply, onCancel }: UserReplyProps) {
  const { handleReplyChange, handlePostReply, reply } = useUserReplyInput(
    commentId,
    onPostReply
  )

  return (
    <>
      <UserCommentInput
        id={`user-reply-${commentId}`}
        title='Responder'
        placeholder='responda esse usuário...'
        comment={reply}
        onCommentChange={handleReplyChange}
        onPost={handlePostReply}
      />
      <button
        type='button'
        className='mt-3 translate-x-6 text-sm text-green-700'
        onClick={onCancel}
      >
        Cancelar resposta
      </button>
    </>
  )
}
