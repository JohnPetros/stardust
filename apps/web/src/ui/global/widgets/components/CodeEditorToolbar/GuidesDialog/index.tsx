'use client'

import type { ReactNode } from 'react'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useGuidesDialog } from './useGuidesDialog'
import { GuidesDialogView } from './GuidesDialogView'

type Props = {
  children: ReactNode
}

export const GuidesDialog = ({ children }: Props) => {
  const { manualService } = useRestContext()
  const {
    isLoading,
    content,
    guides,
    handleDialogOpen,
    handleGuideButtonClick,
    handleBackButtonClick,
  } = useGuidesDialog(manualService)

  return (
    <GuidesDialogView
      isLoading={isLoading}
      content={content}
      guides={guides}
      onDialogOpen={handleDialogOpen}
      onGuideButtonClick={handleGuideButtonClick}
      onBackButtonClick={handleBackButtonClick}
    >
      {children}
    </GuidesDialogView>
  )
}
