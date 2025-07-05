'use client'

import { Id, Text } from '@stardust/core/global/structures'

import { useRest } from '@/ui/global/hooks/useRest'
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
  const { playgroundService } = useRest()
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
