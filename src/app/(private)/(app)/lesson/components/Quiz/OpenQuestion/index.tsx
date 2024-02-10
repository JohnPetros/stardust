'use client'

import { QuestionTitle } from '../QuestionTitle'

import { Input } from './Input'
import { useOpenQuestion } from './useOpenQuestion'

import type { OpenQuestion as OpenQuestionData } from '@/@types/Quiz'
import { CodeSnippet } from '@/app/components/CodeSnippet'

type OpenQuestion = {
  data: OpenQuestionData
}

export function OpenQuestion({
  data: { title, picture, code, answers, lines },
}: OpenQuestion) {
  const { userAnswers, handleInputChange } = useOpenQuestion(answers)

  return (
    <>
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      {code && <CodeSnippet code={code} isRunnable={false} />}

      <ul className="mt-12 space-y-6">
        {lines.map((line) => {
          const marginLeft = 24 * line.indentation

          return (
            <li
              key={line.id}
              style={{ marginLeft }}
              className="flex flex-row items-center gap-3"
            >
              {line.texts.map((text, index) => {
                let inputIndex = 0

                if (text.includes('input')) {
                  inputIndex = Number(text.slice(-1)) - 1
                }

                return (
                  <div key={`${index}-${line.id}`}>
                    {!text.includes('input') ? (
                      <div className="flex gap-1 font-code text-gray-100">
                        {text}
                      </div>
                    ) : (
                      <Input
                        value={userAnswers[inputIndex]}
                        autoCapitalize="none"
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
