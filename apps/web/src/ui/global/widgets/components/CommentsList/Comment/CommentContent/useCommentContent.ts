'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useApi } from '@/ui/global/hooks'
import { useState } from 'react'

export function useCommentContent(
  commentId: string,
  initialContent: string,
  onEdit: () => void,
  onCancel: () => void,
) {
  const [content, setContent] = useState(initialContent)
  const { user } = useAuthContext()
  const toast = useToastContext()
  const api = useApi()

  async function handleEditComment(newContent: string) {
    const response = await api.updateCommentContent(newContent, commentId)

    if (response.isFailure) {
      toast.show(response.errorMessage, {
        type: 'error',
        seconds: 5,
      })
      onCancel()
      return
    }

    onEdit()
  }

  function handleCancelCommentEdition() {
    setContent(initialContent)
    onCancel()
  }

  function handleCommentContentChange(newContent: string) {
    setContent(newContent)
  }

  return {
    content,
    handleEditComment,
    handleCommentContentChange,
    handleCancelCommentEdition,
  }
}
