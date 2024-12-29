'use client'

import { useState } from 'react'

export function useReplyInput(onSendReply: (replyContent: string) => Promise<void>) {
  const [replyContent, setReplyContent] = useState('')

  function handleReplyChange(newReply: string) {
    setReplyContent(newReply)
  }

  async function handleReplySend(newReply: string) {
    await onSendReply(newReply)
  }

  return {
    replyContent,
    handleReplySend,
    handleReplyChange,
  }
}
