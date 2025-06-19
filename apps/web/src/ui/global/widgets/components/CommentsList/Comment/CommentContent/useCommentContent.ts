import { useState } from 'react'

import { Id, Text } from '@stardust/core/global/structures'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { ForumService } from '@stardust/core/forum/interfaces'

type Params = {
  forumService: ForumService
  commentId: string
  initialContent: string
  onEdit: () => void
  onEditionCancel: () => void
}

export function useCommentContent({
  forumService,
  commentId,
  initialContent,
  onEdit,
  onEditionCancel,
}: Params) {
  const [content, setContent] = useState(initialContent)
  const toast = useToastContext()

  async function handleEditComment(newContent: string) {
    const response = await forumService.editComment(
      Text.create(newContent),
      Id.create(commentId),
    )

    if (response.isFailure) {
      toast.show(response.errorMessage, {
        type: 'error',
        seconds: 5,
      })
      onEditionCancel()
      return
    }

    if (response.isSuccessful) {
      setContent(newContent)
      onEdit()
    }
  }

  function handleCancelCommentEdition() {
    setContent(initialContent)
    onEditionCancel()
  }

  return {
    content,
    handleEditComment,
    handleCancelCommentEdition,
  }
}
