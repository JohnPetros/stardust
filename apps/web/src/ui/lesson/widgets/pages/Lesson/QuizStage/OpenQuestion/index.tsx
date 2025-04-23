'use client'

import type { QuestionCodeLine } from '@stardust/core/lesson/structures'

import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'

import { Input } from './Input'
import { QuestionStem } from '../QuestionStem'
import { useOpenQuestion } from './useOpenQuestion'

type OpenQuestionProps = {
  stem: string
  picture: string
  answers: string[]
  codeLines: QuestionCodeLine[]
  code: string | null
}

export function OpenQuestion({
  stem,
  picture,
  code,
  answers,
  codeLines,
}: OpenQuestionProps) {
  const { userAnswers, handleInputChange } = useOpenQuestion(answers)

  return (
    <>
      <QuestionStem picture={picture}>{stem}</QuestionStem>

      {code && (
        <div className='mt-3 w-full'>
          <CodeSnippet code={code} isRunnable={false} />
        </div>
      )}

      <ul className='mt-6 w-[24rem] pr-6 pb-1 md:w-max mx-auto space-y-6  overflow-x-auto'>
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
                const answer = answers[inputIndex]

                if (answer)
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
                          answer={answer}
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
