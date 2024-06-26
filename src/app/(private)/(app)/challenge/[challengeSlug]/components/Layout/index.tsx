'use client'

import { ReactNode } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'

import type { PanelsOffset } from '../../actions/_getPanelsOffset'
import { Slider } from '../Slider'

import { PanelHandle } from './PanelHandle'
import { Tabs } from './Tabs'
import { useChallengeLayout } from './useChallengeLayout'

import { PageTransitionAnimation } from '@/global/components/PageTransitionAnimation'
import { useSecondsCounter } from '@/global/hooks/useSecondsCounter'
import { useChallengeStore } from '@/stores/challengeStore'

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
  const {
    codeEditorPanelRef,
    tabsPanelRef,
    isTransitionPageVisible,
    handlePanelDragging,
  } = useChallengeLayout()
  const isEnd = useChallengeStore((store) => store.state.isEnd)
  const layout = useChallengeStore((store) => store.state.panelsLayout)

  useSecondsCounter(!isEnd)

  return (
    <>
      <PageTransitionAnimation
        isVisible={isTransitionPageVisible}
        hasTips={true}
      />
      <div className="relative md:overflow-hidden">
        {header}
        <main className="w-full">
          <div className="md:hidden">
            <Slider />
          </div>
          <div
            style={{
              paddingInline: HORIZONTAL_PADDNG,
              paddingTop: VERTICAL_PADDNG / 2,
            }}
            className="hidden h-full w-screen grid-cols-[1fr,auto] md:grid"
          >
            {layout === 'tabs-left;code_editor-right' && (
              <PanelGroup direction="horizontal">
                <Panel
                  id="tabs"
                  ref={tabsPanelRef}
                  defaultSize={panelsOffset.tabsPanelSize}
                  minSize={1}
                  order={1}
                >
                  <Tabs>{tabContent}</Tabs>
                </Panel>

                <PanelHandle
                  direction={DIRECTION}
                  onDragging={handlePanelDragging}
                />

                <Panel
                  id="code-editor"
                  ref={codeEditorPanelRef}
                  defaultSize={panelsOffset.codeEditorPanelSize}
                  minSize={1}
                  order={2}
                >
                  {codeEditor}
                </Panel>
              </PanelGroup>
            )}
            {layout === 'tabs-right;code_editor-left' && (
              <PanelGroup direction="horizontal">
                <Panel
                  id="code-editor"
                  ref={codeEditorPanelRef}
                  defaultSize={panelsOffset.codeEditorPanelSize}
                  minSize={1}
                  order={1}
                >
                  {codeEditor}
                </Panel>

                <PanelHandle
                  direction={DIRECTION}
                  onDragging={handlePanelDragging}
                />

                <Panel
                  id="tabs"
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
