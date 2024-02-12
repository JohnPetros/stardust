'use client'

import { useEffect, useMemo, useRef } from 'react'

import { AlertDialogRef } from '@/global/components/AlertDialog/types/AlertDialogRef'
import { useLessonStore } from '@/stores/lessonStore'

export function useQuiz() {
  const { currentQuestionIndex, questions, livesCount } = useLessonStore(
    (store) => store.state
  )

  const currentQuestion = useMemo(() => {
    return questions.length ? questions[currentQuestionIndex] : null
  }, [questions, currentQuestionIndex])

  const alertDialogRef = useRef<AlertDialogRef>(null)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [currentQuestionIndex])

  useEffect(() => {
    if (livesCount === 0) alertDialogRef.current?.open()
  }, [livesCount])

  return {
    alertDialogRef,
    currentQuestion,
  }
}
