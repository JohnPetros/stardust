'use client'

import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { QuestionContainer } from '../QuestionContainer'
import { QuestionTitle } from '../QuestionTitle'
import { CodeText } from '../CodeText'
import { CodeSnippet } from '@/app/components/Text/CodeSnippet'
import { Input } from './Input'

import { compareArrays } from '@/utils/functions'

import type { OpenQuestion as OpenQuestionData } from '@/@types/quiz'

interface OpenQuestion {
  data: OpenQuestionData
}

export function OpenQuestion({
  data: { title, picture, code, answers, lines },
}: OpenQuestion) {
  const {
    state: { isAnswerVerified },
    dispatch,
  } = useLesson()
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array.from<string>({ length: answers.length }).fill('')
  )

  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }
  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    setIsAnswerCorrect(false)

    const isUserAnswerCorrect = compareArrays(userAnswers, answers)

    if (isUserAnswerCorrect) {
      setIsAnswerCorrect(true)

      if (isAnswerVerified) {
        dispatch({ type: 'changeQuestion' })
      }

      return
    }

    setIsAnswerCorrect(false)

    if (
      isAnswerVerified &&
      !hasAlreadyIncrementIncorrectAnswersAmount.current
    ) {
      dispatch({ type: 'incrementIncorrectAswersAmount' })
      hasAlreadyIncrementIncorrectAnswersAmount.current = true
    }

    if (isAnswerVerified) dispatch({ type: 'decrementLivesAmount' })
  }

  function handleInputChange(value: string, index: number) {
    userAnswers[index] = value

    setUserAnswers([...userAnswers])
  }

  useEffect(() => {
    dispatch({
      type: 'setIsAnswered',
      payload:
        userAnswers.filter((answer) => !!answer).length === answers.length,
    })
  }, [userAnswers])

  useEffect(() => {
    dispatch({
      type: 'setAnswerHandler',
      payload: handleAnswer,
    })
  }, [isAnswerVerified, userAnswers])

  return (
    <>
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      {code && <CodeSnippet code={code} isRunnable={false} />}

      <ul className="mt-12">
        {lines.map((line) => (
          <li key={line.id} className="flex flex-row items-center gap-3">
            {line.texts.map((text, index) => {
              let inputIndex = 0

              if (text.includes('input')) {
                inputIndex = Number(text.slice(-1)) - 1
              }

              return (
                <div key={`${index}-${line.id}`}>
                  {!text.includes('input') ? (
                    <div className="flex gap-2 text-gray-100">{text}</div>
                  ) : (
                    <Input
                      value={userAnswers[inputIndex]}
                      autoCapitalize="none"
                      onChange={({ currentTarget }) =>
                        handleInputChange(currentTarget.value, inputIndex)
                      }
                      answer={answers[inputIndex]}
                      autoFocus={inputIndex === 0}
                    />
                  )}
                </div>
              )
            })}
          </li>
        ))}
      </ul>
    </>
  )
}
