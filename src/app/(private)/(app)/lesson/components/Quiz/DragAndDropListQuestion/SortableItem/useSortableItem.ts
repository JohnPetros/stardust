'use client'

import { useMemo } from 'react'

import { SortableItemProps } from '.'

export function useSortableItem({
  isActive,
  isAnswerCorrect,
  isAnswerVerified,
  isDragging,
}: Omit<SortableItemProps, 'id' | 'label'> & { isDragging: boolean }) {
  const color: 'transparent' | 'gray' | 'red' | 'green' | 'blue' =
    useMemo(() => {
      if (isDragging) {
        return 'transparent'
      } else if (isActive) {
        return 'blue'
      } else if (isAnswerVerified && isAnswerCorrect) {
        return 'green'
      } else if (isAnswerVerified && !isAnswerCorrect) {
        return 'red'
      } else {
        return 'gray'
      }
    }, [isDragging, isActive, isAnswerVerified, isAnswerCorrect])

  return {
    color,
  }
}
