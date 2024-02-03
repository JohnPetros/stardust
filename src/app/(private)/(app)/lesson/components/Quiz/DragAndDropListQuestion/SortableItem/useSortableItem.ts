'use client'

import { useMemo } from 'react'

import { SortableItemProps } from '.'

import { countCharacters } from '@/utils/helpers'

export function useSortableItem({
  label,
  isActive,
  isAnswerCorrect,
  isAnswerVerified,
  isDragging,
}: Omit<SortableItemProps, 'id'> & { isDragging: boolean }) {
  const marginLeft = useMemo(() => {
    const tabsCount = countCharacters('\t', label)

    return 24 * tabsCount
  }, [label])

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
    marginLeft,
  }
}
