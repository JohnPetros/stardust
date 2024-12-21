'use client'

import type { ReactNode } from 'react'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useDnd } from './useDnd'

type DndProps = {
  children: ReactNode
  onDragStart: (itemIndex: number) => void
  onDragEnd: (fromPosition: number, toPosition: number) => void
  onDragCancel: VoidFunction
}

export function Dnd({ children, onDragCancel, onDragEnd, onDragStart }: DndProps) {
  const { handleDragStart, handleDragEnd, handleDragCancel } = useDnd({
    onDragCancel,
    onDragEnd,
    onDragStart,
  })
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      {children}
    </DndContext>
  )
}
