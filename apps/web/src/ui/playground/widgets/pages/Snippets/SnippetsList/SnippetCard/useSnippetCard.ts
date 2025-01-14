'use client'

import { useEffect, useRef, useState } from 'react'

import type { SnippetDto } from '@stardust/core/playground/dtos'

import { getAppBaseUrl } from '@/utils'
import { ROUTES } from '@/constants'
import { useClipboard } from '@/ui/global/hooks/useClipboard'
import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { PromptRef } from '@/ui/global/widgets/components/Prompt/types'
import { useEditSnippetAction } from '@/ui/playground/hooks/useEditSnippetAction'

export function useSnippetCard(
  snippetId: string,
  inititlaSnippetTitle: string,
  onDelete: (deletedPlaygroundId: string) => void,
) {
  const snippetUrl = `${getAppBaseUrl()}${ROUTES.playground.snippet(snippetId)}`
  const [snippetTitle, setSnippetTitle] = useState(inititlaSnippetTitle)
  const { copy } = useClipboard(snippetUrl)
  const { isEditing, editSnippet } = useEditSnippetAction({
    onSuccess: handleEditSnippetSuccess,
    onError: handleEditSnippetError,
  })
  const api = useApi()
  const toast = useToastContext()
  const promptRef = useRef<PromptRef>(null)

  async function handleDeleteSnippetButtonClick() {
    const response = await api.deleteSnippet(snippetId)
    if (response.isSuccess) {
      onDelete(snippetId)
      return
    }
    toast.show(response.errorMessage)
  }

  async function handleEditSnippetTitlePromptConfirm() {
    const newSnippetTitle = promptRef.current?.value
    if (!newSnippetTitle) return

    setSnippetTitle(newSnippetTitle)
    promptRef.current.setValue('')
    await editSnippet({ snippetId, snippetTitle: newSnippetTitle })
  }

  function handleEditSnippetSuccess(snippetDto: SnippetDto) {
    setSnippetTitle(snippetDto.title)
  }

  function handleEditSnippetError() {
    setSnippetTitle(inititlaSnippetTitle)
  }

  return {
    snippetTitle,
    snippetUrl,
    promptRef,
    handleDeleteSnippetButtonClick,
    handleEditSnippetTitlePromptConfirm,
  }
}
