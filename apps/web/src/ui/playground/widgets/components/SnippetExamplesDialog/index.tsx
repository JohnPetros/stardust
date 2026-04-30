'use client'

import type { PropsWithChildren } from 'react'

import type { LspSnippet } from '@stardust/core/global/types'

import { SnippetExamplesDialogView } from './SnippetExamplesDialogView'

type SnippetExamplesDialogProps = {
  snippets: LspSnippet[]
  onSelectSnippet: (snippet: LspSnippet) => void
}

export const SnippetExamplesDialog = ({
  children,
  snippets,
  onSelectSnippet,
}: PropsWithChildren<SnippetExamplesDialogProps>) => {
  return (
    <SnippetExamplesDialogView snippets={snippets} onSelectSnippet={onSelectSnippet}>
      {children}
    </SnippetExamplesDialogView>
  )
}
