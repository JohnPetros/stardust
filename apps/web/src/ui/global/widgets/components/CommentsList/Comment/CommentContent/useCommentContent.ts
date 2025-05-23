'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { useState } from 'react'

export function useCommentContent(
  commentId: string,
  initialContent: string,
  onEdit: () => void,
  onCancel: () => void,
) {
  const [content, setContent] = useState(initialContent)
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

    if (response.isSuccessful) {
      setContent(newContent)
      onEdit()
    }
  }

  function handleCancelCommentEdition() {
    setContent(initialContent)
    onCancel()
  }

  return {
    content,
    handleEditComment,
    handleCancelCommentEdition,
  }
}
