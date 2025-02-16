'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'

import { useSelectionQuestion } from './useSelectionQuestion'
import { QuestionStem } from '../QuestionStem'
import { Option } from './Option'
import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'

type SelectionQuestionProps = {
  stem: string
  picture: string
  options: string[]
  code: string | null
}

export function SelectionQuestion({
  stem,
  options,
  picture,
  code,
}: SelectionQuestionProps) {
  const { userAnswer, handleUserAnswerChange } = useSelectionQuestion()

  return (
    <>
      <QuestionStem picture={picture}>{stem}</QuestionStem>

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
