import type { ReactNode, RefObject } from 'react'
import { Panel, type ImperativePanelHandle } from 'react-resizable-panels'
import { twMerge } from 'tailwind-merge'

import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'

export type Props = {
  id: DockablePanelId
  title: string
  children: ReactNode
  panelRef?: RefObject<ImperativePanelHandle | null>
  defaultSize: number
  minSize: number
  order: number
  isDragging: boolean
  isDropTarget: boolean
  setPanelNodeRef: (element: HTMLElement | null) => void
}

export const DockablePanelView = ({
  id,
  title,
  children,
  panelRef,
  defaultSize,
  minSize,
  order,
  isDragging,
  isDropTarget,
  setPanelNodeRef,
}: Props) => {
  return (
    <Panel
      id={id}
      ref={panelRef}
      defaultSize={defaultSize}
      minSize={minSize}
      order={order}
    >
      <section
        ref={setPanelNodeRef}
        aria-label={`Painel ${title}`}
        data-testid={`dockable-panel-${id}`}
        className={twMerge(
          'flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-gray-700 bg-gray-900',
          isDragging && 'opacity-50',
          isDropTarget && 'border-green-400',
        )}
      >
        <div className='min-h-0 flex-1 overflow-hidden'>{children}</div>
      </section>
    </Panel>
  )
}
