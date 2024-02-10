'use client'

import { useState } from 'react'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { useApi } from '@/services/api'
import { APP_ERRORS } from '@/utils/constants'

export function useContent(
  commentId: string,
  initialContent: string,
  onEdit: () => void,
  onCancel: () => void
) {
  const [content, setContent] = useState(initialContent)

  const { user } = useAuthContext()
  const toast = useToastContext()

  const api = useApi()

  async function handleEditComment(newContent: string) {
    if (!user) return

    try {
      await api.editComment(commentId, user.id, newContent)
      onEdit()
    } catch (error) {
      console.error(error)
      toast.show(APP_ERRORS.comments.failedEdition, {
        type: 'error',
        seconds: 5,
      })
      onCancel()
    }
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
