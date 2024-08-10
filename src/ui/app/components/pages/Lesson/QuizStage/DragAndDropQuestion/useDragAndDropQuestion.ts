'use client'

import { useRef, useState } from 'react'

import type { DragAndDrop, DropZone } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

export function useDragAndDropQuestion(
  initialdragAndDrop: DragAndDrop,
  // dropZonesCount: number,
) {
  const [dragAndDrop, setDragAndDrop] = useState<DragAndDrop>(initialdragAndDrop)
  const [activeItemIndex, setActiveItemIndex] = useState<null | number>(null)
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const dropZonesCount = useRef(1)

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
      const item = dragAndDrop.getItemByIndex(itemIndex)

      if (!item) return dragAndDrop

      const newDragAndDrop = dragAndDrop.dragItem(item, dropZone)

      const userItemsIndexesSequence = newDragAndDrop.getDroppedItemDropZoneIndexes()

      console.log(newDragAndDrop)
      console.log(userItemsIndexesSequence)

      if (userItemsIndexesSequence.length === dropZonesCount.current)
        setQuiz(quiz.changeUserAnswer(userItemsIndexesSequence))
      else setQuiz(quiz.changeUserAnswer(null))

      dropZonesCount.current = 1

      return newDragAndDrop
    })
  }

  return {
    dragAndDrop,
    activeItemIndex,
    dropZonesCount,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
