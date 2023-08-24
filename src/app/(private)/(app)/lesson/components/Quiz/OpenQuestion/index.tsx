'use client'

import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { QuestionTitle } from '../QuestionTitle'
import { Input } from './Input'

import type { Open } from '@/types/quiz'
import { QuestionContainer } from '../QuestionContainer'
import { CodeText } from '../CodeText'
import { compareArrays } from '@/utils/functions'

interface OpenQuestion {
  data: Open
  isCurrentQuestion: boolean
}

export function OpenQuestion({
  data: { title, picture, code, answers, lines },
  isCurrentQuestion,
}: OpenQuestion) {
  const {
    state: { isAnswerVerified, isAnswerCorrect, currentQuestionIndex },
    dispatch,
  } = useLesson()
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  console.log(userAnswers)

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
    console.log(userAnswers)

    dispatch({
      type: 'setIsAnswered',
      payload: userAnswers.filter(answer => !!answer).length === answers.length,
    })
  }, [userAnswers])

  useEffect(() => {
    dispatch({
      type: 'setAnswerHandler',
      payload: handleAnswer,
    })
  }, [isAnswerVerified, userAnswers])

  return (
    <QuestionContainer>
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      <ul className="mt-8">
        {lines.map((line) => (
          <li className="flex flex-row items-center gap-3">
            {line.texts.map((text, index) => (
              <div key={`${index}-${line.id}`}>
                {text !== 'input' ? (
                  <div className="flex gap-2">
                    {text.split(' ').map((word) => (
                      <CodeText>{word}</CodeText>
                    ))}
                  </div>
                ) : (
                  <Input
                    value={userAnswers[index]}
                    autoCapitalize="none"
                    onChange={({ currentTarget }) =>
                      handleInputChange(currentTarget.value, index)
                    }
                    answer={answers[index]}
                    autoFocus
                  />
                )}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </QuestionContainer>
  )
}
