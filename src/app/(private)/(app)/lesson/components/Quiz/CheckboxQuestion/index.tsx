import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { QuestionContainer } from '../QuestionContainer'
import { QuestionTitle } from '../QuestionTitle'
import { Checkbox } from './Checkbox'

import type { CheckboxQuestion as CheckboxQuestionData } from '@/types/quiz'

interface CheckboxQuestionProps {
  data: CheckboxQuestionData
}

export function CheckboxQuestion({
  data: { title, picture, options, correctOptions },
}: CheckboxQuestionProps) {
  const {
    state: { isAnswerVerified },
    dispatch,
  } = useLesson()

  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }

  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    const isUserAnswerCorrect =
      userAnswers.length === correctOptions.length &&
      userAnswers.every((userOption) => correctOptions.includes(userOption))

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
    dispatch({ type: 'setIsAnswered', payload: !!userAnswers.length })
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

      <ul className="space-y-2 mt-6">
        {options.map((option) => (
          <Checkbox
            key={option}
            onCheck={() => handleCheckboxChange(option)}
            isChecked={userAnswers.includes(option)}
          >
            {option}
          </Checkbox>
        ))}
      </ul>
    </QuestionContainer>
  )
}
