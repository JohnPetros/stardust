import { QuestionContainer } from '../QuestionContainer'
import { QuestionTitle } from '../QuestionTitle'

import type { CheckboxQuestion as CheckboxQuestionData } from '@/types/quiz'
import { Checkbox } from './Checkbox'

interface CheckboxQuestionProps {
  data: CheckboxQuestionData
}

export function CheckboxQuestion({
  data: { title, picture, options },
}: CheckboxQuestionProps) {
  return (
    <QuestionContainer>
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      <ul className="space-y-2 mt-6">
        {options.map((option) => (
          <Checkbox key={option}>{option}</Checkbox>
        ))}
      </ul>
    </QuestionContainer>
  )
}
