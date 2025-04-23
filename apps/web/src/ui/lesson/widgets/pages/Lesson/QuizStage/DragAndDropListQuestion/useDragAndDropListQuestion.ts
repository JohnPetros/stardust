'use client'

import { useState } from 'react'

import type { SortableList } from '@stardust/core/global/structures'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useDragAndDropListQuestion(preSortableList: SortableList) {
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const [sortableList, setSortableList] = useState<SortableList>(preSortableList)
  const [activeItemId, setActiveItemId] = useState<number | null>(null)

  function handleDragEnd(fromItemPosition: number, toItemPosition: number) {
    if (!quiz) return

    setActiveItemId(null)

    setSortableList((sortableList) => {
      const newSortableList = sortableList.moveItem(fromItemPosition, toItemPosition)
      setQuiz(quiz.changeUserAnswer(newSortableList))

      return newSortableList
    })
  }

  function handleDragStart(activeItemIndex: number) {
    setActiveItemId(activeItemIndex)
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
