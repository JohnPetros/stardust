'use client'

import { useEffect, useRef, useState } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { QuestionTitle } from '../QuestionTitle'

import { Option } from './Option'

import type { SelectionQuestion as SelectionQuestionData } from '@/@types/quiz'
import { CodeSnippet } from '@/app/components/Text/CodeSnippet'
import { useLessonStore } from '@/stores/lessonStore'
import { reorderItems } from '@/utils/helpers'

interface SelectionQuestionProps {
  data: SelectionQuestionData
}

export function SelectionQuestion({
  data: { title, picture, options, code, answer },
}: SelectionQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect },
    actions: {
      setIsAnswered,
      setIsAnswerVerified,
      setIsAnswerCorrect,
      setAnswerHandler,
      changeQuestion,
      incrementIncorrectAswersAmount,
      decrementLivesAmount,
    },
  } = useLessonStore()
  const [selectedOption, setSelectedOption] = useState('')
  const [reorderedOptions, setReorderedOptions] = useState<string[]>([])
  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    if (isAnswerVerified && !!selectedOption) {
      setIsAnswerCorrect(false)
    }

    if (selectedOption.toLowerCase() === answer.toLowerCase()) {
      setIsAnswerCorrect(true)

      if (isAnswerVerified) {
        changeQuestion()
      }

      return
    }

    setIsAnswerCorrect(false)

    if (
      isAnswerVerified &&
      !hasAlreadyIncrementIncorrectAnswersAmount.current
    ) {
      incrementIncorrectAswersAmount()
      hasAlreadyIncrementIncorrectAnswersAmount.current = true
    }

    if (isAnswerVerified) decrementLivesAmount()
  }

  useEffect(() => {
    if (!reorderedOptions.length) {
      const reorderedItems = reorderItems<string>(options)
      setReorderedOptions(reorderedItems)
    }
  }, [options])

  useEffect(() => {
    setIsAnswered(!!selectedOption)
  }, [selectedOption])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
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
