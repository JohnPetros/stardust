import { useRef, useState } from 'react'

import type { PlaygroundService } from '@stardust/core/playground/interfaces'
import { type Id, Text } from '@stardust/core/global/structures'

import { CLIENT_ENV, ROUTES } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { PromptRef } from '@/ui/global/widgets/components/Prompt/types'

type Params = {
  playgroundService: PlaygroundService
  snippetId: Id
  initialSnippetTitle: Text
  onDeleteSnippet: (deletedSnippetId: string) => void
}

export function useSnippetCard({
  playgroundService,
  snippetId,
  initialSnippetTitle,
  onDeleteSnippet,
}: Params) {
  const snippetUrl = `${CLIENT_ENV.webAppUrl}${ROUTES.playground.snippet(snippetId.value)}`
  const [snippetTitle, setSnippetTitle] = useState<Text>(initialSnippetTitle)
  const toast = useToastContext()
  const promptRef = useRef<PromptRef>(null)

  async function handleDeleteSnippetButtonClick() {
    const response = await playgroundService.deleteSnippet(snippetId)
    if (response.isSuccessful) {
      onDeleteSnippet(snippetId.value)
      return
    }
    toast.show(response.errorMessage)
  }

  async function handleEditSnippetTitlePromptConfirm() {
    const newSnippetTitleValue = promptRef.current?.value
    if (!newSnippetTitleValue) return

    const newSnippetTitle = Text.create(newSnippetTitleValue)
    setSnippetTitle(newSnippetTitle)
    promptRef.current.setValue('')

    const response = await playgroundService.editSnippetTitle(snippetId, newSnippetTitle)

    if (response.isSuccessful) {
      setSnippetTitle(newSnippetTitle)
    }

    if (response.isFailure) {
      setSnippetTitle(initialSnippetTitle)
      toast.show(response.errorMessage)
    }
  }

  return {
    snippetTitle,
    snippetUrl,
    promptRef,
    handleDeleteSnippetButtonClick,
    handleEditSnippetTitlePromptConfirm,
  }
}
