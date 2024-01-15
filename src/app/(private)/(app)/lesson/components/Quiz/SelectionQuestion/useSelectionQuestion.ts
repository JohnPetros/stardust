'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useLessonStore } from '@/stores/lessonStore'
import { reorderItems } from '@/utils/helpers'

export function useSelectionQuestion(options: string[], answer: string) {
  const {
    state: { isAnswerVerified },
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

  const handleAnswer = useCallback(() => {
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
  }, [
    answer,
    isAnswerVerified,
    selectedOption,
    setIsAnswerCorrect,
    setIsAnswerVerified,
    incrementIncorrectAswersAmount,
    changeQuestion,
    decrementLivesAmount,
  ])

  useEffect(() => {
    if (!reorderedOptions.length) {
      const reorderedItems = reorderItems<string>(options)
      setReorderedOptions(reorderedItems)
    }
  }, [options, reorderedOptions.length])

  useEffect(() => {
    setIsAnswered(!!selectedOption)
  }, [selectedOption, setIsAnswered])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
  }, [isAnswerVerified, selectedOption, setAnswerHandler, handleAnswer])

  return {
    selectedOption,
    reorderedOptions,
    setSelectedOption,
  }
}
