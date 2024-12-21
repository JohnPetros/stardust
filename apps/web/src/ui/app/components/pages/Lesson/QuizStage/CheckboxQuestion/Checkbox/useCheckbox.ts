'use client'

import { type KeyboardEvent, type RefObject, useMemo } from 'react'

import { useLessonStore } from '@/ui/app/stores/LessonStore'
import type { CheckboxStyle } from './CheckboxStyle'

export function useCheckbox(
  isChecked: boolean,
  checkboxRef: RefObject<HTMLButtonElement>,
) {
  const { getQuizSlice } = useLessonStore()
  const { quiz } = getQuizSlice()

  const style: CheckboxStyle = useMemo(() => {
    if (
      quiz?.userAnswer.isVerified.isTrue &&
      quiz?.userAnswer.isCorrect.isTrue &&
      isChecked
    ) {
      return 'green'
    }

    if (
      quiz?.userAnswer.isVerified.isTrue &&
      quiz?.userAnswer.isCorrect.isFalse &&
      isChecked
    ) {
      return 'red'
    }

    if (isChecked) {
      return 'blue'
    }

    return 'gray'
  }, [quiz, isChecked])

  function handleKeydown({ key }: KeyboardEvent) {
    if (key === ' ') {
      checkboxRef.current?.click()
    }
  }

  return {
    style,
    handleKeydown,
  }
}
