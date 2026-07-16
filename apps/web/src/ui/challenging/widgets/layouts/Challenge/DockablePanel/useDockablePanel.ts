import { useCallback } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'

import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'

type Params = {
  id: DockablePanelId
}

export function useDockablePanel({ id }: Params) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef: setDraggableNodeRef,
  } = useDraggable({ id })
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({ id })

  const setPanelNodeRef = useCallback(
    (element: HTMLElement | null) => {
      setDraggableNodeRef(element)
      setDroppableNodeRef(element)
    },
    [setDraggableNodeRef, setDroppableNodeRef],
  )

  return {
    attributes,
    isDragging,
    isOver,
    listeners,
    setActivatorNodeRef,
    setPanelNodeRef,
  }
}
