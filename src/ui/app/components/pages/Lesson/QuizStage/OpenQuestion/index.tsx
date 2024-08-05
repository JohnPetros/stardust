'use client'

import type { QuestionCodeLine } from '@/@core/domain/structs'

import { CodeSnippet } from '@/ui/global/components/shared/CodeSnippet'
import { QuestionStatement } from '../QuestionStatement'

import { Input } from './Input'
import { useOpenQuestion } from './useOpenQuestion'

type OpenQuestionProps = {
  statement: string
  picture: string
  answers: string[]
  lines: QuestionCodeLine[]
  code: string | null
}

export function OpenQuestion({
  statement,
  picture,
  code,
  answers,
  lines,
}: OpenQuestionProps) {
  const { userAnswers, handleInputChange } = useOpenQuestion(answers)

  return (
    <>
      <QuestionStatement picture={picture}>{statement}</QuestionStatement>

      {code && (
        <div className='w-full'>
          <CodeSnippet code={code} isRunnable={false} />
        </div>
      )}

      <ul className='mt-12 space-y-6'>
        {lines.map((line) => {
          const marginLeft = 24 * line.indentation.value

          return (
            <li
              key={line.number.value}
              style={{ marginLeft }}
              className='flex flex-row items-center gap-3'
            >
              {line.texts.map((text, index) => {
                let inputIndex = 0

                if (text.includes('input')) {
                  inputIndex = Number(text.slice(-1)) - 1
                }

                return (
                  <div key={`${index}-${line.number.value}`}>
                    {!text.includes('input') ? (
                      <div className='flex gap-1 font-code text-gray-100'>{text}</div>
                    ) : (
                      <Input
                        value={userAnswers[inputIndex]}
                        autoCapitalize='none'
                        onChange={({ currentTarget }) =>
                          handleInputChange(currentTarget.value, inputIndex)
                        }
                        answer={answers[inputIndex]}
                        autoFocus={inputIndex === 0}
                      />
                    )}
                  </div>
                )
              })}
            </li>
          )
        })}
      </ul>
    </>
  )
}
