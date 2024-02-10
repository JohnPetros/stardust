'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import type { DraggrableItem } from '@/@types/Quiz'
import { useLessonStore } from '@/stores/lessonStore'
import { compareArrays, reorderItems } from '@/utils/helpers'

export function getDragItemWidth(item: DraggrableItem) {
  const { length } = item.label
  const base = length < 10 ? 2.5 : 3
  return base + length / 2 + 'rem'
}

export function useDragAndDropQuestion(
  dragItems: DraggrableItem[],
  correctDragItemsIdsSequence: number[]
) {
  const {
    state: { isAnswerVerified, currentQuestionIndex },
    actions: {
      setIsAnswered,
      setIsAnswerVerified,
      setIsAnswerCorrect,
      setAnswerHandler,
      changeQuestion,
      incrementIncorrectAswersCount,
      decrementLivesCount,
    },
  } = useLessonStore()
  const [activeDraggableItemId, setActiveDraggableItemId] = useState<
    null | number
  >(null)
  const [draggableItems, setDraggableItems] =
    useState<DraggrableItem[]>(dragItems)
  const userDragItemsIdsSenquence = useRef<number[]>([])
  const hasAlreadyIncrementIncorrectAnswersCount = useRef(false)

  const activeDraggableItem = draggableItems.find(
    (drag) => drag.id === activeDraggableItemId
  )

  const handleAnswer = useCallback(() => {
    setIsAnswerVerified(!isAnswerVerified)

    const isUserAnswerCorrect = compareArrays(
      userDragItemsIdsSenquence.current,
      correctDragItemsIdsSequence
    )

    if (isUserAnswerCorrect) {
      setIsAnswerCorrect(true)

      if (isAnswerVerified) {
        changeQuestion()
      }
      return
    }

    setIsAnswerCorrect(false)

    if (isAnswerVerified && !hasAlreadyIncrementIncorrectAnswersCount.current) {
      incrementIncorrectAswersCount()
      hasAlreadyIncrementIncorrectAnswersCount.current = true
    }

    if (isAnswerVerified) decrementLivesCount()
  }, [
    correctDragItemsIdsSequence,
    isAnswerVerified,
    changeQuestion,
    decrementLivesCount,
    incrementIncorrectAswersCount,
    setIsAnswerCorrect,
    setIsAnswerVerified,
  ])

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

  useEffect(() => {
    const hasUserAnswer =
      userDragItemsIdsSenquence.current.length ===
      correctDragItemsIdsSequence.length

    setIsAnswered(hasUserAnswer)
  }, [
    correctDragItemsIdsSequence.length,
    currentQuestionIndex,
    activeDraggableItemId,
    setIsAnswered,
  ])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
  }, [isAnswerVerified, activeDraggableItemId, setAnswerHandler, handleAnswer])

  useEffect(() => {
    const reorderedDraggableItems = reorderItems<DraggrableItem>(dragItems)

    setDraggableItems(
      reorderedDraggableItems.map((item) => ({
        ...item,
        dropZoneId: `bank-${item.id}`,
      }))
    )
  }, [dragItems])

  return {
    draggableItems,
    userDragItemsIdsSenquence,
    activeDraggableItem,
    activeDraggableItemId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
