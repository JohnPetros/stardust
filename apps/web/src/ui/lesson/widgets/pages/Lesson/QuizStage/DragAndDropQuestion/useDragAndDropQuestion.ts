'use client'

import { useRef, useState } from 'react'

import type { DragAndDrop, DropZone, QuestionCodeLine } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

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

    const userItemIndexesSenquence: number[] = []

    for (const line of codeLines) {
      line.texts.forEach((text, index) => {
        const item = newDragAndDrop.getItemByDropZone(index + 1)
        if (text === 'dropZone' && item) {
          userItemIndexesSenquence.push(item.index.value)
        }
      })
    }

    if (userItemIndexesSenquence.length === dropZonesCount)
      setQuiz(quiz.changeUserAnswer(userItemIndexesSenquence))
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
