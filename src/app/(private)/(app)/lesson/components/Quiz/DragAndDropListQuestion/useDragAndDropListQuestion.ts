'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import type { SortableItem as SortableItemData } from '@/@types/quiz'
import { useLessonStore } from '@/stores/lessonStore'
import { compareArrays, reorderItems } from '@/utils/helpers'

export function useDragAndDropListQuestion(items: SortableItemData[]) {
  const {
    state: { isAnswerVerified },
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

  const [sortableItems, setSortableItems] = useState<SortableItemData[]>([])
  const [activeSortableItemId, setActiveSortableItemId] = useState<
    number | null
  >(null)

  const hasAlreadyIncrementIncorrectAnswersCount = useRef(false)

  const handleAnswer = useCallback(() => {
    function checkUserAnswerCorrect() {
      const correctDragItemsIdsSequence = items.map((item) => item.id)

      const userItemsIdSequence = sortableItems.map((item) => item.id)
      return compareArrays(userItemsIdSequence, correctDragItemsIdsSequence)
    }

    setIsAnswerVerified(!isAnswerVerified)

    const isUserAnswerCorrect = checkUserAnswerCorrect()

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
    items,
    sortableItems,
    isAnswerVerified,
    changeQuestion,
    decrementLivesCount,
    incrementIncorrectAswersCount,
    setIsAnswerCorrect,
    setIsAnswerVerified,
  ])

  function handleDragEnd(event: DragEndEvent) {
    setActiveSortableItemId(null)

    const { active, over } = event

    if (over && active.id !== over?.id) {
      setSortableItems((sortableItems) => {
        const activeIndex = sortableItems.findIndex(
          (item) => item.id === active.id
        )
        const overIndex = sortableItems.findIndex((item) => item.id === over.id)
        return arrayMove(sortableItems, activeIndex, overIndex)
      })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveSortableItemId(Number(event.active.id))
  }

  function handleDragCancel() {
    setActiveSortableItemId(null)
  }

  useEffect(() => {
    setIsAnswered(true)

    if (!sortableItems.length) {
      const reorderedSortableItems = reorderItems<SortableItemData>(items)
      setSortableItems(reorderedSortableItems)
    }
  }, [items, sortableItems.length, setIsAnswered, setSortableItems])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
  }, [isAnswerVerified, sortableItems, setAnswerHandler, handleAnswer])

  return {
    activeSortableItemId,
    sortableItems,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
