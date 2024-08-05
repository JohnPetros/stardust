'use client'

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type { SortableList } from '@/@core/domain/structs'
import { useDragAndDropListQuestion } from './useDragAndDropListQuestion'
import { QuestionStatement } from '../QuestionStatement'
import { Item } from './Item'

type DragAndDropListQuestionProps = {
  statement: string
  picture: string
  preSortableList: SortableList
}

export function DragAndDropListQuestion({
  statement,
  preSortableList,
  picture,
}: DragAndDropListQuestionProps) {
  const { sortableList, activeItemId, handleDragStart, handleDragEnd, handleDragCancel } =
    useDragAndDropListQuestion(preSortableList)

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <QuestionStatement picture={picture}>{statement}</QuestionStatement>

        <SortableContext
          items={sortableList.items.map((item) => ({ id: item.originalPosition.value }))}
          strategy={verticalListSortingStrategy}
        >
          <div className='mx-auto mt-6 w-full space-y-2'>
            {sortableList.items.map((item) => (
              <Item
                key={item.originalPosition.value}
                id={item.originalPosition.value}
                label={item.label}
                isActive={activeItemId === item.originalPosition.value}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItemId ? (
            <Item
              id={activeItemId}
              label={sortableList.getItemByPosition(activeItemId).label}
              isActive={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}
