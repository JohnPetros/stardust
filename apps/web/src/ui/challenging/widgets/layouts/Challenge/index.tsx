'use client'

import { useRef, type ReactNode } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import type {
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
} from 'react-resizable-panels'

import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useChallengeLayout } from './useChallengeLayout'
import type { PanelsOffset } from './types'
import { ChallengeLayoutView } from './ChallengeLayoutView'

type LayoutProps = {
  header: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
  panelOrder: DockablePanelId[]
  panelsOffset: PanelsOffset
}

export const ChallengeLayout = ({
  header,
  tabContent,
  codeEditor,
  panelOrder: initialPanelOrder,
  panelsOffset,
}: LayoutProps) => {
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
  const tabsPanelRef = useRef<ImperativePanelHandle>(null)
  const codeEditorPanelRef = useRef<ImperativePanelHandle>(null)
  const assistantPanelRef = useRef<ImperativePanelHandle>(null)
  const { md: isMobile } = useBreakpoint()
  const {
    activePanelId,
    isTransitionPageVisible,
    panelSizes,
    visiblePanelOrder,
    handleDragEnd,
    handleDragStart,
    handlePanelLayoutChange,
  } = useChallengeLayout({
    panelGroupRef,
    tabsPanelRef,
    codeEditorPanelRef,
    assistantPanelRef,
    initialPanelOrder,
    initialPanelsOffset: panelsOffset,
  })
  return (
    <ChallengeLayoutView
      header={header}
      tabContent={tabContent}
      codeEditor={codeEditor}
      activePanelId={activePanelId}
      panelGroupRef={panelGroupRef}
      panelSizes={panelSizes}
      visiblePanelOrder={visiblePanelOrder}
      tabsPanelRef={tabsPanelRef}
      codeEditorPanelRef={codeEditorPanelRef}
      assistantPanelRef={assistantPanelRef}
      isTransitionPageVisible={isTransitionPageVisible}
      isMobile={isMobile}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onPanelLayoutChange={handlePanelLayoutChange}
    />
  )
}
