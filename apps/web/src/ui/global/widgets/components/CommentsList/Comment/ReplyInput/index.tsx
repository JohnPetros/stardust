import { CommentInput } from '../../CommentInput'
import { useReplyInput } from './useReplyInput'

type ReplyInputProps = {
  commentId: string
  onSend: (replyContent: string) => Promise<void>
  onCancel: () => void
}

export function ReplyInput({ commentId, onSend, onCancel }: ReplyInputProps) {
  const { handleReplySend } = useReplyInput(onSend)

  return (
    <>
      <CommentInput
        id={`reply-${commentId}`}
        title='Responder'
        placeholder='responda esse usuário...'
        onSend={handleReplySend}
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
