'use client'

import { useRef, useState } from 'react'

import type { DragAndDrop, DropZone } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

export function useDragAndDropQuestion(
  initialdragAndDrop: DragAndDrop,
  dropZonesCount: number,
) {
  const [dragAndDrop, setDragAndDrop] = useState<DragAndDrop>(initialdragAndDrop)
  const [activeItemIndex, setActiveItemIndex] = useState<null | number>(null)
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const [userItemIndexesSenquence, setUserItemIndexesSenquence] = useState<number[]>([])

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

      setUserItemIndexesSenquence([])

      return newDragAndDrop
    })
  }

  return {
    dragAndDrop,
    activeItemIndex,
    userItemIndexesSenquence,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
