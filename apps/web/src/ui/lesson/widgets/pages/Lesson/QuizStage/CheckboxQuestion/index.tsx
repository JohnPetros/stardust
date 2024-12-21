'use client'

import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'
import { QuestionStatement } from '../QuestionStatement'
import { Checkbox } from './Checkbox'
import { useCheckboxQuestion } from './useCheckboxQuestion'

type CheckboxQuestionProps = {
  statement: string
  picture: string
  options: string[]
  code: string | null
}

export function CheckboxQuestion({
  statement,
  options,
  picture,
  code,
}: CheckboxQuestionProps) {
  const { handleCheckboxChange, userAnswers } = useCheckboxQuestion()

  return (
    <>
      <QuestionStatement picture={picture}>{statement}</QuestionStatement>

      {code && (
        <div className='mt-3 w-full'>
          <CodeSnippet code={code} isRunnable={false} />
        </div>
      )}

      <ul className='mt-6 space-y-2'>
        {options.map((option) => (
          <li key={option}>
            <Checkbox
              onCheck={() => handleCheckboxChange(option)}
              isChecked={userAnswers.includes(option).isTrue}
            >
              {option}
            </Checkbox>
          </li>
        ))}
      </ul>
    </>
  )
}
