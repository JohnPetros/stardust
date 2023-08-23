'use client'

import { useEffect, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  closestCorners,
  useDroppable,
  defaultDropAnimation,
  DropAnimation,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from '@dnd-kit/core'

import { QuestionTitle } from '../QuestionTitle'
import { DropZone } from './DropZone'
import { DragItem } from './DragItem'

import type { DragAndDropClick, DraggrableItem } from '@/types/quiz'
import { arrayMove } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { DropBank } from './DropBank'

interface DragAndDropClickQuestionProps {
  data: DragAndDropClick
  isCurrentQuestion: boolean
}

export function DragAndDropClickQuestion({
  data: { title, lines, dragItems, picture },
  isCurrentQuestion,
}: DragAndDropClickQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect, currentQuestionIndex },
    dispatch,
  } = useLesson()
  const [activeDraggableItemId, setActiveDraggableItemId] = useState<
    null | number
  >(null)
  const [draggableItems, setDraggableItems] =
    useState<DraggrableItem[]>(dragItems)

  const { setNodeRef } = useDroppable({
    id: 'bank',
  })

  const activeDraggableItem = draggableItems.find(
    (drag) => drag.id === activeDraggableItemId
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveDraggableItemId(Number(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDraggableItemId(null)

    const { active, over } = event


    if (
      over?.data.current?.type === 'bank' &&
      active.data.current?.bankId !== over.id
    ) {
      return
    }

    return


    if (!over) return

    setDraggableItems((draggableItems) => {
      const activeIndex = draggableItems.findIndex(
        (item) => item.id === active.id
      )

      const draggableItem = draggableItems[activeIndex]

      draggableItem.dropZoneId = String(over.id)

      return arrayMove(draggableItems, activeIndex, activeIndex)
    })
  }

  function handleDragCancel() {
    setActiveDraggableItemId(null)
  }

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  // useEffect(() => {
  //   setDraggableItems(
  //     dragItems.map((item) => ({ ...item, dropZoneId: `bank-${item.id}` }))
  //   )
  // }, [])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="mx-auto mt-4 w-full max-w-xl flex flex-col items-center justify-center px-6">
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <ul className="space-y-4 mt-6">
          {lines.map((line) => (
            <li key={line.id} className="flex items-center gap-3">
              {line.texts.map((text, index) => {
                const id = `${index}-${line.id}`
                return (
                  <div key={id}>
                    {text !== 'droppable' ? (
                      <span className="text-gray-100">{text}</span>
                    ) : (
                      <DropZone
                        id={id}
                        droppedItem={
                          draggableItems.find(
                            (item) => item.dropZoneId === id
                          ) ?? null
                        }
                        activeDraggableItemId={activeDraggableItemId}
                      />
                    )}
                  </div>
                )
              })}
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap gap-3 mt-24 px-24">
          {draggableItems.map((item) => {
            return (
              <DropBank id={item.id}>
                <DragItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  isAnswerVerified={isAnswerVerified}
                  isAnswerCorrect={isAnswerVerified && isAnswerCorrect}
                  isActive={activeDraggableItemId === item.id}
                  isDropped={item.dropZoneId !== 'bank'}
                />
              </DropBank>
            )
          })}
          {createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeDraggableItem ? (
                <DragItem
                  key={activeDraggableItem.id}
                  id={activeDraggableItem.id}
                  label={activeDraggableItem.label}
                  isAnswerVerified={isAnswerVerified}
                  isAnswerCorrect={isAnswerVerified && isAnswerCorrect}
                  isActive={true}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </ul>
      </div>
    </DndContext>
  )
}
