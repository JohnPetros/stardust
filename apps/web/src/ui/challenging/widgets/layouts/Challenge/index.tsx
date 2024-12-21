'use client'

import { useRef, type ReactNode } from 'react'
import type { PanelsOffset } from './PanelsOffset'
import { type ImperativePanelHandle, Panel, PanelGroup } from 'react-resizable-panels'
import { useChallengeLayout } from './useChallengeLayout'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { PageTransitionAnimation } from '@/ui/global/components/shared/PageTransitionAnimation'
import { Slider } from './Slider'
import { Tabs } from './Tabs'
import { PanelHandle } from './PandleHandle'

const DIRECTION = 'horizontal'
const HORIZONTAL_PADDNG = 24
const VERTICAL_PADDNG = 24

type LayoutProps = {
  header: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
  panelsOffset: PanelsOffset
}

export function ChallengeLayout({
  header,
  tabContent,
  codeEditor,
  panelsOffset,
}: LayoutProps) {
  const tabsPanelRef = useRef<ImperativePanelHandle>(null)
  const codeEditorPanelRef = useRef<ImperativePanelHandle>(null)
  const { isTransitionPageVisible, handlePanelDragging } = useChallengeLayout(
    tabsPanelRef,
    codeEditorPanelRef,
  )
  const { getPanelsLayoutSlice } = useChallengeStore()
  const { panelsLayout } = getPanelsLayoutSlice()

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionPageVisible} hasTips={true} />
      <div className='relative md:overflow-hidden'>
        {header}
        <main className='w-full'>
          <div className='md:hidden'>
            <Slider />
          </div>
          <div
            style={{
              paddingInline: HORIZONTAL_PADDNG,
              paddingTop: VERTICAL_PADDNG / 2,
            }}
            className='hidden h-full w-screen grid-cols-[1fr,auto] md:grid'
          >
            {panelsLayout === 'tabs-left;code_editor-right' && (
              <PanelGroup direction='horizontal'>
                <Panel
                  id='tabs'
                  ref={tabsPanelRef}
                  defaultSize={panelsOffset.tabsPanelSize}
                  minSize={1}
                  order={1}
                >
                  <Tabs>{tabContent}</Tabs>
                </Panel>

                <PanelHandle direction={DIRECTION} onDragging={handlePanelDragging} />

                <Panel
                  id='code-editor'
                  ref={codeEditorPanelRef}
                  defaultSize={panelsOffset.codeEditorPanelSize}
                  minSize={1}
                  order={2}
                >
                  {codeEditor}
                </Panel>
              </PanelGroup>
            )}
            {panelsLayout === 'tabs-right;code_editor-left' && (
              <PanelGroup direction='horizontal'>
                <Panel
                  id='code-editor'
                  ref={codeEditorPanelRef}
                  defaultSize={panelsOffset.codeEditorPanelSize}
                  minSize={1}
                  order={1}
                >
                  {codeEditor}
                </Panel>

                <PanelHandle direction={DIRECTION} onDragging={handlePanelDragging} />

                <Panel
                  id='tabs'
                  ref={tabsPanelRef}
                  defaultSize={panelsOffset.tabsPanelSize}
                  minSize={1}
                  order={2}
                >
                  <Tabs>{tabContent}</Tabs>
                </Panel>
              </PanelGroup>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
