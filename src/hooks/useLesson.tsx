'use client'

import { useContext } from 'react'
import { LessonContext } from '@/contexts/LessonContext'

export function useLesson() {
  const context = useContext(LessonContext)

  if (!context) {
    throw new Error('useLesson must be used inside LessonContext')
  }

  return context
}
