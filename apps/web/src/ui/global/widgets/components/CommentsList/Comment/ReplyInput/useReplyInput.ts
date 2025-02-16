'use client'

export function useReplyInput(onSendReply: (replyContent: string) => Promise<void>) {
  async function handleReplySend(replyContent: string) {
    await onSendReply(replyContent)
  }

  return {
    handleReplySend,
  }
}
