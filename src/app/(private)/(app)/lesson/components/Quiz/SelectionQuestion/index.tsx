'use client'

import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { Title } from '../Title'
import { Option } from './Option'
import * as RadioGroup from '@radix-ui/react-radio-group'

import type { SelectionQuestion } from '@/types/question'

interface SelectionQuestionProps {
  data: SelectionQuestion
}

export function SelectionQuestion({
  data: { title, picture, options, code, answer },
}: SelectionQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect },
    dispatch,
  } = useLesson()
  const [selectedOption, setSelectedOption] = useState('')
  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }

  function resetAnswer() {
    if (isAnswerVerified && !!selectedOption) {
      // setSelectedOption('')
      setIsAnswerCorrect(false)
    }
  }

  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)
    resetAnswer()

    if (selectedOption.toLowerCase() === answer.toLowerCase()) {
      setIsAnswerCorrect(true)

      // if (isAnswerVerified) {
      //   dispatch({ type: 'changeQuestion' })
      // }

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

  useEffect(() => {
    dispatch({ type: 'setIsAnswered', payload: !!selectedOption })
  }, [selectedOption])

  useEffect(() => {
    dispatch({
      type: 'setAnswerHandler',
      payload: handleAnswer,
    })
  }, [isAnswerVerified, selectedOption])

  return (
    <>
      <div className="mx-auto mt-16 w-full max-w-xl flex flex-col items-center justify-center">
        <Title picture={picture}>{title}</Title>

        <RadioGroup.Root className="mt-16 space-y-3">
          {options.map((option) => (
            <Option
              key={option}
              label={option}
              isSelected={selectedOption === option}
              isAnswerIncorrect={isAnswerVerified && !isAnswerCorrect}
              isAnswerCorrect={
                isAnswerVerified && isAnswerCorrect && option === answer
              }
              onClick={() => setSelectedOption(option)}
            />
          ))}
        </RadioGroup.Root>
      </div>
    </>
  )
}
