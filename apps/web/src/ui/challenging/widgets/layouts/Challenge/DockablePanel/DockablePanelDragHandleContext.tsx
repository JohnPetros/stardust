import { createContext, useContext } from 'react'
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'

export type DockablePanelDragHandle = {
  attributes: DraggableAttributes
  listeners?: DraggableSyntheticListeners
  setRef: (element: HTMLElement | null) => void
}

const DockablePanelDragHandleContext = createContext<DockablePanelDragHandle | null>(null)

export const DockablePanelDragHandleProvider = DockablePanelDragHandleContext.Provider

export function useDockablePanelDragHandle() {
  return useContext(DockablePanelDragHandleContext)
}
