'use client'

import type { QuestionCodeLine } from '@/@core/domain/structs'

import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'

import { Input } from './Input'
import { QuestionStatement } from '../QuestionStatement'
import { useOpenQuestion } from './useOpenQuestion'

type OpenQuestionProps = {
  statement: string
  picture: string
  answers: string[]
  codeLines: QuestionCodeLine[]
  code: string | null
}

export function OpenQuestion({
  statement,
  picture,
  code,
  answers,
  codeLines,
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
        {codeLines.map((codeLine) => {
          const marginLeft = 24 * codeLine.indentation.value

          return (
            <li
              key={codeLine.number.value}
              style={{ marginLeft }}
              className='flex flex-row items-center gap-3'
            >
              {codeLine.texts.map((text, index) => {
                let inputIndex = 0

                if (text.includes('input')) {
                  inputIndex = Number(text.slice(-1)) - 1
                }

                return (
                  <div key={`${index}-${codeLine.number.value}`}>
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
