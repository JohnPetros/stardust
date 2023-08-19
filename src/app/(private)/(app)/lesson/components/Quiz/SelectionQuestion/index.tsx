'use client'

import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { QuestionTitle } from '../QuestionTitle'
import { Option } from './Option'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { questionAnimations, questionTransition } from '..'
import { AnimatePresence, motion } from 'framer-motion'

import type { SelectionQuestion as SelectionQuestionData } from '@/types/quiz'
import { reorderItems } from '@/utils/functions'

interface SelectionQuestionProps {
  data: SelectionQuestionData
  isCurrentQuestion: boolean
}

export function SelectionQuestion({
  data: { title, picture, options, code, answer },
  isCurrentQuestion,
}: SelectionQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect, currentQuestionIndex },
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

  function resetAnswer() {
    if (isAnswerVerified && !!selectedOption) {
      // setSelectedOption('')
      setIsAnswerCorrect(false)
    }
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
    <AnimatePresence>
      <motion.div
        key={currentQuestionIndex}
        variants={questionAnimations}
        initial="right"
        animate={isCurrentQuestion ? 'middle' : ''}
        exit="left"
        transition={questionTransition}
        className="mx-auto w-full max-w-xl flex flex-col items-center justify-center"
      >
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <RadioGroup.Root className="mt-8 space-y-2">
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
      </motion.div>
    </AnimatePresence>
  )
}
