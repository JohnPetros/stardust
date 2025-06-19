import { CommentInput } from '../../CommentInput'

type Props = {
  commentId: string
  onSend: (replyContent: string) => Promise<void>
  onCancel: () => void
}

export const ReplyInputView = ({ commentId, onSend, onCancel }: Props) => {
  return (
    <>
      <CommentInput
        id={`reply-${commentId}`}
        title='Responder'
        placeholder='responda esse usuário...'
        onSend={onSend}
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
