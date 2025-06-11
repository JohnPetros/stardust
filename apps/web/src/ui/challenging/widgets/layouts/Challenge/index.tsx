'use client'

import { useRef, type ReactNode } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import type { ImperativePanelHandle } from 'react-resizable-panels'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useChallengeLayout } from './useChallengeLayout'
import type { PanelsOffset } from './types'
import { ChallengeLayoutView } from './ChallengeLayoutView'

type LayoutProps = {
  header: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
  panelsOffset: PanelsOffset
}

export const ChallengeLayout = ({
  header,
  tabContent,
  codeEditor,
  panelsOffset,
}: LayoutProps) => {
  const tabsPanelRef = useRef<ImperativePanelHandle>(null)
  const codeEditorPanelRef = useRef<ImperativePanelHandle>(null)
  const { isTransitionPageVisible, handlePanelDragging } = useChallengeLayout(
    tabsPanelRef,
    codeEditorPanelRef,
  )
  const { getPanelsLayoutSlice } = useChallengeStore()
  const { panelsLayout } = getPanelsLayoutSlice()

  return (
    <ChallengeLayoutView
      header={header}
      tabContent={tabContent}
      codeEditor={codeEditor}
      panelsOffset={panelsOffset}
      panelsLayout={panelsLayout}
      tabsPanelRef={tabsPanelRef}
      codeEditorPanelRef={codeEditorPanelRef}
      isTransitionPageVisible={isTransitionPageVisible}
      handlePanelDragging={handlePanelDragging}
    />
  )
}
