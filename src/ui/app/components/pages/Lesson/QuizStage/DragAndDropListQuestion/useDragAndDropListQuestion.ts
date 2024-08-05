'use client'

import { useState } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import type { SortableList } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

export function useDragAndDropListQuestion(preSortableList: SortableList) {
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const [sortableList, setSortableList] = useState<SortableList>(preSortableList)
  const [activeItemId, setActiveItemId] = useState<number | null>(null)

  function handleDragEnd(event: DragEndEvent) {
    if (!quiz) return

    setActiveItemId(null)

    const { active, over } = event

    if (over && active.id !== over.id) {
      setSortableList((sortableList) => {
        const newSortableList = sortableList.moveItem(Number(active.id), Number(over.id))
        setQuiz(quiz.changeUserAnswer(newSortableList))

        return newSortableList
      })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveItemId(Number(event.active.id))
  }

  function handleDragCancel() {
    setActiveItemId(null)
  }

  return {
    sortableList,
    activeItemId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
