'use client'

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DropAnimation,
} from '@dnd-kit/core'

import type { DraggableItem, DropZone } from '@stardust/core/lesson/structures'

import { getItemWidth } from '../getItemWidth'
import { Item } from '../Item'
import { useDnd } from './useDnd'

type DragAndDropSensorsProps = {
  children: ReactNode
  activeItem: DraggableItem | null
  onDragStart: (itemIndex: number) => void
  onDragEnd: (itemIndex: number, dropZone: DropZone) => void
  onDragCancel: VoidFunction
}

export function Dnd({
  children,
  activeItem,
  onDragStart,
  onDragEnd,
  onDragCancel,
}: DragAndDropSensorsProps) {
  const { handleDragStart, handleDragEnd, handleDragCancel } = useDnd({
    onDragStart,
    onDragEnd,
    onDragCancel,
  })

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeItem ? (
            <Item
              index={activeItem.index.value}
              label={activeItem.label.value}
              originalDropZoneIndex={activeItem.originalDropZoneIndex.value}
              width={getItemWidth(activeItem.label.value)}
              isActive={true}
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
