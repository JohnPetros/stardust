'use client'

import { KeyboardEvent, useMemo, useRef } from 'react'

import { useLessonStore } from '@/stores/lessonStore'

export function useCheckbox(isChecked: boolean) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )
  const checkRef = useRef<HTMLButtonElement>(null)

  const color: 'gray' | 'red' | 'green' | 'blue' = useMemo(() => {
    {
      if (isAnswerCorrect && isAnswerVerified && isChecked) {
        return 'green'
      } else if (isAnswerVerified && isChecked) {
        return 'red'
      } else if (isChecked) {
        return 'blue'
      } else {
        return 'gray'
      }
    }
  }, [isAnswerCorrect, isAnswerVerified, isChecked])

  function handleKeydown({ key }: KeyboardEvent) {
    if (key === ' ') {
      checkRef.current?.click()
    }
  }

  return {
    checkRef,
    color,
    handleKeydown,
  }
}
