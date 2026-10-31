import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'

import { QuizContext } from '@/ui/lesson/contexts/QuizContext'

export function useQuizContext() {
  const context = useContext(QuizContext)

  if (!context) {
    throw new AppError('useQuizContext must be used within a QuizContextProvider')
  }

  return context
}
