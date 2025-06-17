import { useReplyInput } from './useReplyInput'
import { ReplyInputView } from './ReplyInputView'

type Props = {
  commentId: string
  onSend: (replyContent: string) => Promise<void>
  onCancel: () => void
}

export const ReplyInput = ({ commentId, onSend, onCancel }: Props) => {
  const { handleReplySend } = useReplyInput(onSend)

  return (
    <ReplyInputView commentId={commentId} onSend={handleReplySend} onCancel={onCancel} />
  )
}
