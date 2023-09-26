'use client'

import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { CodeSnippet } from '@/app/components/Text/CodeSnippet'
import { QuestionTitle } from '../QuestionTitle'
import { Option } from './Option'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { reorderItems } from '@/utils/functions'
import type { SelectionQuestion as SelectionQuestionData } from '@/@types/quiz'

interface SelectionQuestionProps {
  data: SelectionQuestionData
}

export function SelectionQuestion({
  data: { title, picture, options, code, answer },
}: SelectionQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect },
    dispatch,
  } = useLesson()
  const [selectedOption, setSelectedOption] = useState('')
  const [reorderedOptions, setReorderedOptions] = useState<string[]>([])
  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }

  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    if (isAnswerVerified && !!selectedOption) {
      setIsAnswerCorrect(false)
    }

    if (selectedOption.toLowerCase() === answer.toLowerCase()) {
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

  useEffect(() => {
    if (!reorderedOptions.length) {
      const reorderedItems = reorderItems<string>(options)
      setReorderedOptions(reorderedItems)
    }
  }, [])

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
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      {code && (
        <div className="mt-3 w-full">
          <CodeSnippet code={code} isRunnable={false} />
        </div>
      )}

      <RadioGroup.Root className="mt-6 space-y-2 ">
        {reorderedOptions.map((option) => (
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
    </>
  )
}
