import { Fragment, useEffect, useState, type ReactNode, type RefObject } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  type ImperativePanelGroupHandle,
  type ImperativePanelHandle,
  PanelGroup,
} from 'react-resizable-panels'

import { PageTransitionAnimation } from '@/ui/global/widgets/components/PageTransitionAnimation'
import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ChallengeSlider } from './ChallengeSlider'
import { PanelHandle } from './PanelHandle'
import { ChallengeTabs } from './ChallengeTabs'
import { AssistantChatbot } from './AssistantChatbot'
import { DockablePanel } from './DockablePanel'
import { MIN_PANEL_SIZES } from './constants/panel-layout'

const HORIZONTAL_PADDNG = 24
const VERTICAL_PADDNG = 24
const PANEL_TITLES = {
  tabs: 'Conteúdo',
  code_editor: 'Editor',
  assistant: 'Assistente',
} as const satisfies Record<DockablePanelId, string>
const PANEL_MIN_SIZES = {
  tabs: MIN_PANEL_SIZES.tabs,
  code_editor: MIN_PANEL_SIZES.codeEditor,
  assistant: MIN_PANEL_SIZES.assistant,
} as const satisfies Record<DockablePanelId, number>

type Props = {
  activePanelId: DockablePanelId | null
  isTransitionPageVisible: boolean
  isMobile: boolean
  header: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
  panelGroupRef: RefObject<ImperativePanelGroupHandle | null>
  panelSizes: Record<DockablePanelId, number>
  visiblePanelOrder: DockablePanelId[]
  tabsPanelRef: RefObject<ImperativePanelHandle | null>
  codeEditorPanelRef: RefObject<ImperativePanelHandle | null>
  assistantPanelRef: RefObject<ImperativePanelHandle | null>
  onDragEnd: (event: DragEndEvent) => void
  onDragStart: (event: DragStartEvent) => void
  onPanelLayoutChange: (layout: number[]) => void
}

export const ChallengeLayoutView = ({
  activePanelId,
  header,
  tabContent,
  codeEditor,
  panelGroupRef,
  panelSizes,
  visiblePanelOrder,
  tabsPanelRef,
  codeEditorPanelRef,
  assistantPanelRef,
  isTransitionPageVisible,
  isMobile,
  onDragEnd,
  onDragStart,
  onPanelLayoutChange,
}: Props) => {
  const [isDesktopPanelsReady, setIsDesktopPanelsReady] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  useEffect(() => {
    setIsDesktopPanelsReady(true)
  }, [])

  function getPanelRef(panelId: DockablePanelId) {
    if (panelId === 'tabs') return tabsPanelRef
    if (panelId === 'code_editor') return codeEditorPanelRef
    return assistantPanelRef
  }

  function renderPanelContent(panelId: DockablePanelId) {
    if (panelId === 'tabs') return <ChallengeTabs>{tabContent}</ChallengeTabs>
    if (panelId === 'code_editor') return codeEditor
    return <AssistantChatbot />
  }

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionPageVisible} hasTips />
      <div className='relative md:overflow-hidden'>
        {header}
        <main className='w-full'>
          <div className='md:hidden'>
            <ChallengeSlider>{tabContent}</ChallengeSlider>
          </div>
          <div
            style={{
              paddingInline: HORIZONTAL_PADDNG,
              paddingTop: VERTICAL_PADDNG / 2,
            }}
            className='hidden h-full w-screen grid-cols-[1fr,auto] md:grid'
          >
            {isDesktopPanelsReady && !isMobile && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                <PanelGroup
                  ref={panelGroupRef}
                  direction='horizontal'
                  onLayout={onPanelLayoutChange}
                >
                  {visiblePanelOrder.map((panelId, index) => (
                    <Fragment key={panelId}>
                      <DockablePanel
                        id={panelId}
                        title={PANEL_TITLES[panelId]}
                        panelRef={getPanelRef(panelId)}
                        defaultSize={panelSizes[panelId]}
                        minSize={PANEL_MIN_SIZES[panelId]}
                        order={index + 1}
                      >
                        {renderPanelContent(panelId)}
                      </DockablePanel>

                      {index < visiblePanelOrder.length - 1 && (
                        <PanelHandle
                          aria-label={`Redimensionar ${PANEL_TITLES[panelId]}`}
                        />
                      )}
                    </Fragment>
                  ))}
                </PanelGroup>

                <DragOverlay>
                  {activePanelId && (
                    <div className='flex items-center gap-2 rounded-md border border-green-400 bg-gray-800 px-3 py-2 text-green-400 shadow-lg'>
                      <Icon name='layout' size={16} />
                      <span className='font-medium text-sm'>
                        {PANEL_TITLES[activePanelId]}
                      </span>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
