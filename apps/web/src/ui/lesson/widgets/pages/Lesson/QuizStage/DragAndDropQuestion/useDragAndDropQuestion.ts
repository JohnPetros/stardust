'use client'

import { useEffect, useRef, useState } from 'react'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'
import type {
  DragAndDrop,
  DropZone,
  QuestionCodeLine,
} from '@stardust/core/lesson/structs'
import { DragAndDropQuestion } from '@stardust/core/lesson/entities'

type UseDragAndDropQuestionProps = {
  initialDragAndDrop: DragAndDrop
  dropZoneSlotsCount: number
  dropZoneSlotsIndexes: Record<string, number>
  codeLines: QuestionCodeLine[]
}

export function useDragAndDropQuestion({
  codeLines,
  dropZoneSlotsCount,
  dropZoneSlotsIndexes,
  initialDragAndDrop,
}: UseDragAndDropQuestionProps) {
  const [dragAndDrop, setDragAndDrop] = useState<DragAndDrop>(initialDragAndDrop)
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
      line.texts.forEach((_, textIndex) => {
        const key = DragAndDropQuestion.getDropZoneSlotKey(line, textIndex)
        if (!key) return
        const dropZoneIndex = dropZoneSlotsIndexes[key]
        if (!dropZoneIndex) return

        const item = newDragAndDrop.getItemByDropZone(dropZoneIndex)
        if (item) userItems.push(item.label.value)
      })
    }

    console.log(dropZoneSlotsCount)
    if (userItems.length === dropZoneSlotsCount) setQuiz(quiz.changeUserAnswer(userItems))
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
