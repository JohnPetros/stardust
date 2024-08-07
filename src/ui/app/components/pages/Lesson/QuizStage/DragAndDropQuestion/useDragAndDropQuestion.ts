'use client'

import { useState } from 'react'

import type { DragAndDrop, DropZone } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

export function useDragAndDropQuestion(initialdragAndDrop: DragAndDrop) {
  const [dragAndDrop, setDragAndDrop] = useState<DragAndDrop>(initialdragAndDrop)
  const [userItemsIndexesSequence, setUserItemsIndexesSequence] = useState<number[]>([])
  const [activeItemIndex, setActiveItemIndex] = useState<null | number>(null)
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()

  function handleDragStart(activeItemIndex: number) {
    setActiveItemIndex(activeItemIndex)
  }

  function handleDragCancel() {
    setActiveItemIndex(null)
  }

  function handleDragEnd(itemIndex: number, dropZone: DropZone) {
    if (!quiz) return

    setActiveItemIndex(null)

    setDragAndDrop((dragAndDrop) => {
      const item = dragAndDrop.getIemByIndex(itemIndex)

      if (!item) return dragAndDrop

      const newDragAndDrop = dragAndDrop.dragItem(item, dropZone)

      const userItemsIndexesSequence = newDragAndDrop.getItemDropZoneIndexes()

      if (userItemsIndexesSequence.length === newDragAndDrop.items.length)
        setQuiz(quiz.changeUserAnswer(userItemsIndexesSequence))

      // setUserItemsIndexesSequence(userItemsIndexesSequence)

      return newDragAndDrop
    })
  }

  return {
    dragAndDrop,
    activeItemIndex,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
