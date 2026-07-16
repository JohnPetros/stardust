import type { ReactNode, RefObject } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'

import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'
import { DockablePanelDragHandleProvider } from './DockablePanelDragHandleContext'
import { DockablePanelView } from './DockablePanelView'
import { useDockablePanel } from './useDockablePanel'

type Props = {
  id: DockablePanelId
  title: string
  children: ReactNode
  panelRef?: RefObject<ImperativePanelHandle | null>
  defaultSize: number
  minSize: number
  order: number
}

export const DockablePanel = ({
  id,
  title,
  children,
  panelRef,
  defaultSize,
  minSize,
  order,
}: Props) => {
  const {
    attributes,
    isDragging,
    isOver,
    listeners,
    setActivatorNodeRef,
    setPanelNodeRef,
  } = useDockablePanel({ id })

  return (
    <DockablePanelDragHandleProvider
      value={{
        attributes,
        listeners,
        setRef: setActivatorNodeRef,
      }}
    >
      <DockablePanelView
        id={id}
        title={title}
        panelRef={panelRef}
        defaultSize={defaultSize}
        minSize={minSize}
        order={order}
        isDragging={isDragging}
        isDropTarget={isOver && !isDragging}
        setPanelNodeRef={setPanelNodeRef}
      >
        {children}
      </DockablePanelView>
    </DockablePanelDragHandleProvider>
  )
}
