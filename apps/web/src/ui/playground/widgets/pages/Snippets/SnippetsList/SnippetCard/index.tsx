'use client'

import { Id, Text } from '@stardust/core/global/structures'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { SnippetCardView } from './SnippetCardView'
import { useSnippetCard } from './useSnippetCard'

type Props = {
  snippetId: string
  snippetTitle: string
  onDeleteSnippet: (deletedSnippetId: string) => void
}

export const SnippetCard = ({
  snippetId,
  snippetTitle: initialSnippetTitle,
  onDeleteSnippet,
}: Props) => {
  const { playgroundService } = useRestContext()
  const {
    snippetTitle,
    snippetUrl,
    promptRef,
    handleEditSnippetTitlePromptConfirm,
    handleDeleteSnippetButtonClick,
  } = useSnippetCard({
    playgroundService,
    snippetId: Id.create(snippetId),
    initialSnippetTitle: Text.create(initialSnippetTitle),
    onDeleteSnippet,
  })

  return (
    <SnippetCardView
      snippetId={snippetId}
      title={snippetTitle.value}
      snippetUrl={snippetUrl}
      promptRef={promptRef}
      onDeleteSnippetButtonClick={handleDeleteSnippetButtonClick}
      onEditSnippetTitlePromptConfirm={handleEditSnippetTitlePromptConfirm}
    />
  )
}
