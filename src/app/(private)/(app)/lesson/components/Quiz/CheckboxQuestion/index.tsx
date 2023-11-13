import { useEffect, useRef, useState } from 'react'

import { QuestionTitle } from '../QuestionTitle'

import { Checkbox } from './Checkbox'

import type { CheckboxQuestion as CheckboxQuestionData } from '@/@types/quiz'
import { useLessonStore } from '@/stores/lessonStore'

interface CheckboxQuestionProps {
  data: CheckboxQuestionData
}

export function CheckboxQuestion({
  data: { title, picture, options, correctOptions },
}: CheckboxQuestionProps) {
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

  function handleAnswer() {
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
  }

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
  }, [userAnswers])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
  }, [isAnswerVerified, userAnswers])

  return (
    <>
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      <ul className="mt-6 space-y-2">
        {options.map((option) => (
          <li key={option}>
            <Checkbox
              onCheck={() => handleCheckboxChange(option)}
              isChecked={userAnswers.includes(option)}
            >
              {option}
            </Checkbox>
          </li>
        ))}
      </ul>
    </>
  )
}
