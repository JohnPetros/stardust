'use client'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { QuestionTitle } from '../QuestionTitle'

import { SortableItem } from './SortableItem'
import { useDragAndDropListQuestion } from './useDragAndDropListQuestion'

import type { DragAndDropListQuestion as DragAndDropListQuestionData } from '@/@types/Quiz'
import { useLessonStore } from '@/stores/lessonStore'

type DragAndDropListQuestionProps = {
  data: DragAndDropListQuestionData
}

export function DragAndDropListQuestion({
  data: { title, items, picture },
}: DragAndDropListQuestionProps) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )
  const {
    sortableItems,
    activeSortableItemId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDropListQuestion(items)

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
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <div className="mx-auto mt-6 w-full space-y-2">
            {sortableItems.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                label={item.label}
                isAnswerCorrect={isAnswerCorrect}
                isAnswerVerified={isAnswerVerified}
                isActive={activeSortableItemId === item.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSortableItemId ? (
            <SortableItem
              id={activeSortableItemId}
              label={
                sortableItems.find((item) => item.id === activeSortableItemId)
                  ?.label ?? ''
              }
              isAnswerCorrect={isAnswerCorrect}
              isAnswerVerified={isAnswerVerified}
              isActive={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}
