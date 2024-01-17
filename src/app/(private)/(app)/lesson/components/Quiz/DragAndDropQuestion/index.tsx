'use client'

import { createPortal } from 'react-dom'
import {
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  DropAnimation,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import { QuestionTitle } from '../QuestionTitle'

import { DragItem } from './DragItem'
import { DropBank } from './DropBank'
import { DropZone } from './DropZone'
import { useDragAndDropQuestion } from './useDragAndDropQuestion'

import type {
  DragAndDropQuestion as DragAndDropQuestionData,
  DraggrableItem,
} from '@/@types/quiz'

export function getDragItemWidth(item: DraggrableItem) {
  const { length } = item.label
  const base = length < 10 ? 2.5 : 3
  return base + length / 2 + 'rem'
}

interface DragAndDropClickQuestionProps {
  data: DragAndDropQuestionData
}

export function DragAndDropQuestion({
  data: { title, lines, dragItems, picture, correctDragItemsIdsSequence },
}: DragAndDropClickQuestionProps) {
  const {
    draggableItems,
    userDragItemsIdsSenquence,
    activeDraggableItem,
    activeDraggableItemId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDropQuestion(dragItems, correctDragItemsIdsSequence)

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

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <ul className="mt-6 space-y-4">
          {lines.map((line) => (
            <li key={line.id} className="flex items-center gap-3">
              {line.texts.map((text, index) => {
                const id = `${index}-${line.id}`
                return (
                  <div key={id}>
                    {text !== 'dropZone' ? (
                      <span className="font-code text-gray-100">{text}</span>
                    ) : (
                      <DropZone
                        id={id}
                        droppedItem={
                          draggableItems.find(
                            (item) => item.dropZoneId === id
                          ) ?? null
                        }
                        activeDraggableItemId={activeDraggableItemId}
                        userDragItemsIdsSenquence={userDragItemsIdsSenquence}
                      />
                    )}
                  </div>
                )
              })}
            </li>
          ))}
        </ul>

        <ul className="mt-12 flex w-full flex-wrap justify-center gap-3">
          {draggableItems.map((item) => {
            const itemWidth = getDragItemWidth(item)
            return (
              <DropBank
                key={item.id}
                id={`bank-${item.id}`}
                dropItemId={item.dropZoneId ?? ''}
                width={itemWidth}
              >
                <DragItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  isActive={activeDraggableItemId === item.id}
                  width={itemWidth}
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
                  isActive={true}
                  width={getDragItemWidth(activeDraggableItem)}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </ul>
      </DndContext>
    </>
  )
}
