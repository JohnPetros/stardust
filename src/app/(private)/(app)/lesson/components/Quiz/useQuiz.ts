'use client'

import { useEffect, useMemo, useRef } from 'react'

import { AlertRef } from '@/app/components/Alert'
import { useLessonStore } from '@/stores/lessonStore'

export function useQuiz() {
  const { currentQuestionIndex, questions, livesCount } = useLessonStore(
    (store) => store.state
  )

  const currentQuestion = useMemo(() => {
    return questions.length ? questions[currentQuestionIndex] : null
  }, [questions, currentQuestionIndex])
  
  const alertRef = useRef<AlertRef>(null)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [currentQuestionIndex])

  useEffect(() => {
    if (livesCount === 0) alertRef.current?.open()
  }, [livesCount])

  return {
    alertRef,
    currentQuestion,
  }
}
