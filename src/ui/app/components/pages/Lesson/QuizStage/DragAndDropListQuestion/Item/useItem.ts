'use client'

import { useMemo } from 'react'

import { Text } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'
import type { IconColor } from './IconColor'
import type { LabelBackground } from './LabelBackground'

type UseSortableItemProps = {
  label: string
  isActive: boolean
  isDragging: boolean
}

export function useItem({ label, isActive, isDragging }: UseSortableItemProps) {
  const { getQuizSlice } = useLessonStore()
  const { quiz } = getQuizSlice()

  const marginLeft = useMemo(() => {
    const labelText = Text.create(label)
    const tabsCount = labelText.countCharacters('\t')

    return 24 * tabsCount
  }, [label])

  const labelBackground: LabelBackground = useMemo(() => {
    if (isDragging) {
      return 'transparent'
    }
    if (isActive) {
      return 'blue'
    }
    if (quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isTrue) {
      return 'green'
    }
    if (quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isFalse) {
      return 'red'
    }
    return 'gray'
  }, [isDragging, isActive, quiz])

  const iconColor: IconColor = useMemo(() => {
    if (isActive) {
      return 'blue'
    }
    if (quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isTrue) {
      return 'green'
    }
    if (quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isFalse) {
      return 'red'
    }
    return 'gray'
  }, [isActive, quiz])

  return {
    labelBackground,
    iconColor,
    marginLeft,
  }
}