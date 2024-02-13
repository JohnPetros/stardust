'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { reorderItems } from '@/global/helpers'
import { checkIncludedArray } from '@/global/helpers/checkIncludedArray'
import { useLessonStore } from '@/stores/lessonStore'

export function useSelectionQuestion(options: string[], answer: string) {
  const {
    state: { isAnswerVerified, currentQuestionIndex },
    actions: {
      setIsAnswered,
      setIsAnswerVerified,
      setIsAnswerCorrect,
      setAnswerHandler,
      changeQuestion,
      incrementIncorrectAswersCount,
      decrementLivesCount,
    },
  } = useLessonStore()

  const [selectedOption, setSelectedOption] = useState('')
  const [reorderedOptions, setReorderedOptions] = useState<string[]>([])
  const hasAlreadyIncrementIncorrectAnswersCount = useRef(false)

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

    if (isAnswerVerified && !hasAlreadyIncrementIncorrectAnswersCount.current) {
      incrementIncorrectAswersCount()
      hasAlreadyIncrementIncorrectAnswersCount.current = true
    }

    if (isAnswerVerified) decrementLivesCount()
  }, [
    answer,
    isAnswerVerified,
    selectedOption,
    setIsAnswerCorrect,
    setIsAnswerVerified,
    incrementIncorrectAswersCount,
    changeQuestion,
    decrementLivesCount,
  ])

  useEffect(() => {
    const hasNewOptions = !checkIncludedArray(options, reorderedOptions)

    if (!reorderedOptions.length || hasNewOptions) {
      const reorderedItems = reorderItems(options)
      setReorderedOptions(reorderedItems)
    }
  }, [options, reorderedOptions.length, reorderedOptions])

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
