import { useState } from 'react'

import { QuestionContainer } from '../QuestionContainer'
import { QuestionTitle } from '../QuestionTitle'
import { Checkbox } from './Checkbox'

import type { CheckboxQuestion as CheckboxQuestionData } from '@/types/quiz'

interface CheckboxQuestionProps {
  data: CheckboxQuestionData
}

export function CheckboxQuestion({
  data: { title, picture, options },
}: CheckboxQuestionProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  console.log(userAnswers);

  function handleCheckboxChange(checkedOption: string) {
    if (userAnswers.includes(checkedOption)) {
      setUserAnswers((userAnswers) =>
        userAnswers.filter((answer) => answer !== checkedOption)
      )
      return
    }

    setUserAnswers((userAnswers) => [...userAnswers, checkedOption])
  }

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
