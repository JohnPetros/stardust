'use client'

import type { PropsWithChildren } from 'react'

import { CLIENT_ENV, ROUTES } from '@/constants'
import { useShareSnippetDialog } from './useShareSnippetDialog'
import { ShareSnippetDialogView } from './ShareSnippetDialogView'

type Props = {
  snippetId: string
}

export const ShareSnippetDialog = ({ children, snippetId }: PropsWithChildren<Props>) => {
  const playgroundUrl = `${CLIENT_ENV.webAppUrl}${ROUTES.playground.snippet(snippetId)}`
  const { handleShareSnippet } = useShareSnippetDialog(playgroundUrl)

  return (
    <ShareSnippetDialogView
      playgroundUrl={playgroundUrl}
      onShareSnippet={handleShareSnippet}
    >
      {children}
    </ShareSnippetDialogView>
  )
}
