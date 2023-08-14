'use client'
import { useState } from 'react'

import { DragAndDropList, Item as SortableItem } from '@/types/question'
import { QuestionTitle } from '../QuestionTitle'
import { Item } from './Item'

import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'

interface DragAndDropListQuestionProps {
  data: DragAndDropList
}

export function DragAndDropListQuestion({
  data: { title, items, picture },
}: DragAndDropListQuestionProps) {
  const [sortableItems, setSortableItems] = useState<SortableItem[]>(items)
  const [activeItemId, setActiveEventId] = useState<number | null>(null)

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  function handleDragEnd(event: DragEndEvent) {
    setActiveEventId(null)

    const { active, over } = event

    if (over && active.id !== over?.id) {
      setSortableItems((sortableItems) => {
        const overIndex = sortableItems.findIndex(
          (item) => item.id === active.id
        )
        const activeIndex = sortableItems.findIndex(
          (item) => item.id === over.id
        )
        return arrayMove(sortableItems, overIndex, activeIndex)
      })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveEventId(Number(event.active.id))
  }

  function handleDragCancel() {
    setActiveEventId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <div className="mx-auto mt-16 w-full max-w-xl flex flex-col items-center justify-center cursor-grab">
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <div className="mx-auto w-full space-y-2 mt-8">
            {sortableItems.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                label={item.label}
                isActive={activeItemId === item.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItemId ? (
            <Item
              id={activeItemId}
              label={
                sortableItems.find((item) => item.id === activeItemId)?.label ??
                ''
              }
              isActive={true}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
