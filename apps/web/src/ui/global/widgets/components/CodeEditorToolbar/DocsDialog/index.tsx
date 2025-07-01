'use client'

import type { ReactNode } from 'react'

import { useRest } from '@/ui/global/hooks/useRest'
import { useDocsDialog } from './useDocsDialog'
import { DocsDialogView } from './DocsDialogView'

type Props = {
  children: ReactNode
}

export const DocsDialog = ({ children }: Props) => {
  const { documentationService } = useRest()
  const {
    isLoading,
    content,
    docs,
    handleDialogOpen,
    handleDocButtonClick,
    handleBackButtonClick,
  } = useDocsDialog(documentationService)

  return (
    <DocsDialogView
      isLoading={isLoading}
      content={content}
      docs={docs}
      onDialogOpen={handleDialogOpen}
      onDocButtonClick={handleDocButtonClick}
      onBackButtonClick={handleBackButtonClick}
    >
      {children}
    </DocsDialogView>
  )
}
