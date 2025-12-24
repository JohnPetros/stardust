'use client'

import type { ReactNode } from 'react'

import { useRest } from '@/ui/global/hooks/useRest'
import { useGuidesDialog } from './useGuidesDialog'
import { GuidesDialogView } from './GuidesDialogView'

type Props = {
  children: ReactNode
}

export const GuidesDialog = ({ children }: Props) => {
  const { ManualService } = useRest()
  const {
    isLoading,
    content,
    guides,
    handleDialogOpen,
    handleGuideButtonClick,
    handleBackButtonClick,
  } = useGuidesDialog(ManualService)

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
