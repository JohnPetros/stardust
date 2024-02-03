'use client'

import { QuestionTitle } from '../QuestionTitle'

import { Checkbox } from './Checkbox'
import { useCheckboxQuestion } from './useCheckboxQuestion'

import type { CheckboxQuestion as CheckboxQuestionData } from '@/@types/quiz'
import { CodeSnippet } from '@/app/components/CodeSnippet'

interface CheckboxQuestionProps {
  data: CheckboxQuestionData
}

export function CheckboxQuestion({
  data: { title, picture, options, correctOptions, code },
}: CheckboxQuestionProps) {
  const { handleCheckboxChange, userAnswers } =
    useCheckboxQuestion(correctOptions)

  return (
    <>
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      {code && (
        <div className="mt-3 w-full">
          <CodeSnippet code={code} isRunnable={false} />
        </div>
      )}

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
