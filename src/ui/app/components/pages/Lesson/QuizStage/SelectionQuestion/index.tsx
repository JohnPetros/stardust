'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'

import { useSelectionQuestion } from './useSelectionQuestion'
import { QuestionStatement } from '../QuestionStatement'
import { Option } from './Option'
import { CodeSnippet } from '@/ui/global/components/shared/CodeSnippet'

type SelectionQuestionProps = {
  statement: string
  picture: string
  options: string[]
  code: string | null
}

export function SelectionQuestion({
  statement,
  options,
  picture,
  code,
}: SelectionQuestionProps) {
  const { userAnswer, handleUserAnswerChange } = useSelectionQuestion()

  return (
    <>
      <QuestionStatement picture={picture}>{statement}</QuestionStatement>

      {code && (
        <div className='mt-3 w-full'>
          <CodeSnippet code={code} isRunnable={false} />
        </div>
      )}

      <RadioGroup.Root className='mt-6 space-y-2'>
        {options.map((option, index) => (
          <Option
            key={option}
            label={option}
            isSelected={userAnswer === option}
            onClick={() => handleUserAnswerChange(option)}
            hasAutoFocus={index === 0}
          />
        ))}
      </RadioGroup.Root>
    </>
  )
}
