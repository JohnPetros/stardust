'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useLessonStore } from '@/stores/lessonStore'

export function useCheckboxQuestion(correctOptions: string[]) {
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

  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  const handleAnswer = useCallback(() => {
    setIsAnswerVerified(!isAnswerVerified)

    const isUserAnswerCorrect =
      userAnswers.length === correctOptions.length &&
      userAnswers.every((userOption) => correctOptions.includes(userOption))

    if (isUserAnswerCorrect) {
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
    correctOptions,
    userAnswers,
    isAnswerVerified,
    changeQuestion,
    incrementIncorrectAswersAmount,
    decrementLivesAmount,
    setIsAnswerCorrect,
    setIsAnswerVerified,
  ])

  function handleCheckboxChange(checkedOption: string) {
    if (userAnswers.includes(checkedOption)) {
      setUserAnswers((userAnswers) =>
        userAnswers.filter((answer) => answer !== checkedOption)
      )
      return
    }

    setUserAnswers((userAnswers) => [...userAnswers, checkedOption])
  }

  useEffect(() => {
    setIsAnswered(!!userAnswers.length)
  }, [userAnswers, setIsAnswered])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
  }, [isAnswerVerified, userAnswers, setAnswerHandler, handleAnswer])

  return {
    handleCheckboxChange,
  }
}
