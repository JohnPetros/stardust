'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useLessonStore } from '@/stores/lessonStore'
import { compareArrays } from '@/utils/helpers'

export function useOpenQuestion(answers: string[]) {
  const {
    state: { isAnswerVerified },
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
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array.from<string>({ length: answers.length }).fill('')
  )

  const hasAlreadyIncrementIncorrectAnswersCount = useRef(false)

  const handleAnswer = useCallback(() => {
    setIsAnswerVerified(!isAnswerVerified)

    setIsAnswerCorrect(false)

    const isUserAnswerCorrect = compareArrays(userAnswers, answers)

    if (isUserAnswerCorrect) {
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
    answers,
    isAnswerVerified,
    userAnswers,
    changeQuestion,
    decrementLivesCount,
    incrementIncorrectAswersCount,
    setIsAnswerCorrect,
    setIsAnswerVerified,
  ])

  function handleInputChange(value: string, index: number) {
    userAnswers[index] = value

    setUserAnswers([...userAnswers])
  }

  useEffect(() => {
    setIsAnswered(
      userAnswers.filter((answer) => !!answer).length === answers.length
    )
  }, [userAnswers, answers.length, setIsAnswered])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
  }, [isAnswerVerified, userAnswers, handleAnswer, setAnswerHandler])

  return {
    userAnswers,
    handleInputChange,
  }
}
