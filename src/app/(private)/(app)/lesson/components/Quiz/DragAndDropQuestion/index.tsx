'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import { QuestionTitle } from '../QuestionTitle'

import { DragItem } from './DragItem'
import { DropBank } from './DropBank'
import { DropZone } from './DropZone'

import type {
  DragAndDropQuestion as DragAndDropData,
  DraggrableItem,
} from '@/@types/quiz'
import { useLesson } from '@/hooks/useLesson'
import { compareArrays } from '@/utils/functions'

export function getDragItemWidth(item: DraggrableItem) {
  const { length } = item.label
  const base = length < 10 ? 2.5 : 3
  return base + length / 2 + 'rem'
}

interface DragAndDropClickQuestionProps {
  data: DragAndDropData
}

export function DragAndDropQuestion({
  data: { title, lines, dragItems, picture, correctDragItemsIdsSequence },
}: DragAndDropClickQuestionProps) {
  const {
    state: { isAnswerVerified, currentQuestionIndex },
    dispatch,
  } = useLesson()
  const [activeDraggableItemId, setActiveDraggableItemId] = useState<
    null | number
  >(null)
  const [draggableItems, setDraggableItems] =
    useState<DraggrableItem[]>(dragItems)
  const userDragItemsIdsSenquence = useRef<number[]>([])
  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  const activeDraggableItem = draggableItems.find(
    (drag) => drag.id === activeDraggableItemId
  )

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }

  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    const isUserAnswerCorrect = compareArrays(
      userDragItemsIdsSenquence.current,
      correctDragItemsIdsSequence
    )

    if (isUserAnswerCorrect) {
      setIsAnswerCorrect(true)

      if (isAnswerVerified) {
        dispatch({ type: 'changeQuestion' })
      }
      return
    }

    setIsAnswerCorrect(false)

    if (
      isAnswerVerified &&
      !hasAlreadyIncrementIncorrectAnswersAmount.current
    ) {
      dispatch({ type: 'incrementIncorrectAswersAmount' })
      hasAlreadyIncrementIncorrectAnswersAmount.current = true
    }

    if (isAnswerVerified) dispatch({ type: 'decrementLivesAmount' })
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDraggableItemId(Number(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDraggableItemId(null)

    const { active, over } = event

    if (!over) return

    setDraggableItems((draggableItems) => {
      const activeIndex = draggableItems.findIndex(
        (item) => item.id === active.id
      )

      const overIndex = draggableItems.findIndex(
        (item) => item.dropZoneId === over.id
      )

      const activeDraggableItem = draggableItems[activeIndex]
      const overDraggableItem = draggableItems[overIndex]

      if (over.data.current?.type === 'bank') {
        activeDraggableItem.dropZoneId = active.data.current?.bankId
        return draggableItems
      }

      if (
        over.data.current?.type === 'zone' &&
        over.data.current?.hasDroppedItem
      ) {
        const overDropZoneId = overDraggableItem.dropZoneId
        const activeDropZoneId = activeDraggableItem.dropZoneId

        if (!active.data.current?.isInZone) {
          overDraggableItem.dropZoneId = `bank-${overDraggableItem.id}`
          activeDraggableItem.dropZoneId = overDropZoneId

          return draggableItems
        }

        activeDraggableItem.dropZoneId = overDropZoneId
        overDraggableItem.dropZoneId = activeDropZoneId

        return draggableItems
      }

      const draggableItem = draggableItems[activeIndex]

      draggableItem.dropZoneId = String(over.id)

      return draggableItems
    })

    userDragItemsIdsSenquence.current = []
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

  useEffect(() => {
    const hasUserAnswer =
      userDragItemsIdsSenquence.current.length ===
      correctDragItemsIdsSequence.length

    if (hasUserAnswer) {
      dispatch({
        type: 'setIsAnswered',
        payload: true,
      })
    }
  }, [currentQuestionIndex, activeDraggableItemId])

  useEffect(() => {
    dispatch({
      type: 'setAnswerHandler',
      payload: handleAnswer,
    })
  }, [isAnswerVerified, activeDraggableItemId])

  useEffect(() => {
    setDraggableItems(
      dragItems.map((item) => ({ ...item, dropZoneId: `bank-${item.id}` }))
    )
  }, [])

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
            console.log({ itemWidth })

            return (
              <DropBank
                key={item.id}
                id={`bank-${item.id}`}
                dropItemId={item.dropZoneId}
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
