'use client'

import { useLesson } from '@/hooks/useLesson'

import { QuestionTitle } from '../QuestionTitle'
import { Input } from './Input'

import type { OpenQuestion as OpenQuestionData } from '@/types/quiz'
import { useState } from 'react'

interface OpenQuestion {
  data: OpenQuestionData
  isCurrentQuestion: boolean
}

export function OpenQuestion({
  data: { title, picture, code, answer },
}: OpenQuestion) {
  const {
    state: { isAnswerVerified, isAnswerCorrect, currentQuestionIndex },
    dispatch,
  } = useLesson()
  const [userAnswer, setUserAnswer] = useState('')

  return (
    <>
      <div className="mx-auto mt-4 w-full max-w-xl flex flex-col items-center justify-center">
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <div className="mt-12">
          <Input
            value={userAnswer}
            isAnswerCorrect={isAnswerCorrect}
            isAnswerVerified={isAnswerVerified}
            autoCapitalize="none"
            onChange={({ currentTarget }) => setUserAnswer(currentTarget.value)}
          />
        </div>
      </div>
    </>
  )
}
