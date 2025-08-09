import { createContext, type PropsWithChildren } from 'react'

import { useQuizContextProvider } from './useQuizContextProvider'
import type { QuizContextValue } from './QuizContextValue'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'

export const QuizContext = createContext({} as QuizContextValue)

type Props = PropsWithChildren<{
  questions: QuestionDto[]
}>

export const QuizContextProvider = ({ children, questions }: Props) => {
  const quizContextValue = useQuizContextProvider(questions)

  return <QuizContext.Provider value={quizContextValue}>{children}</QuizContext.Provider>
}
