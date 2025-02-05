'use client'

import { useState } from 'react'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'
import type {
  DragAndDrop,
  DropZone,
  QuestionCodeLine,
} from '@stardust/core/lesson/structs'

export function useDragAndDropQuestion(
  initialdragAndDrop: DragAndDrop,
  dropZonesCount: number,
  codeLines: QuestionCodeLine[],
) {
  const [dragAndDrop, setDragAndDrop] = useState<DragAndDrop>(initialdragAndDrop)
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

    const item = dragAndDrop.getItemByIndex(itemIndex)

    if (!item) return

    const newDragAndDrop = dragAndDrop.dragItem(item, dropZone)

    const userItems: string[] = []

    for (const line of codeLines) {
      line.texts.forEach((text, index) => {
        const item = newDragAndDrop.getItemByDropZone(index + 1)
        if (text === 'dropZone' && item) {
          userItems.push(item.label.value)
        }
      })
    }

    if (userItems.length === dropZonesCount) setQuiz(quiz.changeUserAnswer(userItems))
    else setQuiz(quiz.changeUserAnswer(null))

    setDragAndDrop(newDragAndDrop)
  }

  return {
    dragAndDrop,
    activeItemIndex,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
