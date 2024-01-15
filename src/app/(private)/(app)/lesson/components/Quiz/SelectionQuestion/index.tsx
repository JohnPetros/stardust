'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'

import { QuestionTitle } from '../QuestionTitle'

import { Option } from './Option'
import { useSelectionQuestion } from './useSelectionQuestion'

import type { SelectionQuestion as SelectionQuestionData } from '@/@types/quiz'
import { CodeSnippet } from '@/app/components/CodeSnippet'
import { useLessonStore } from '@/stores/lessonStore'

type SelectionQuestionProps = {
  data: SelectionQuestionData
}

export function SelectionQuestion({
  data: { title, picture, options, code, answer },
}: SelectionQuestionProps) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )
  const { selectedOption, reorderedOptions, setSelectedOption } =
    useSelectionQuestion(options, answer)

  return (
    <>
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      {code && (
        <div className="mt-3 w-full">
          <CodeSnippet code={code} isRunnable={false} />
        </div>
      )}

      <RadioGroup.Root className="mt-6 space-y-2 ">
        {reorderedOptions.map((option) => (
          <Option
            key={option}
            label={option}
            isSelected={selectedOption === option}
            isAnswerIncorrect={isAnswerVerified && !isAnswerCorrect}
            isAnswerCorrect={
              isAnswerVerified && isAnswerCorrect && option === answer
            }
            onClick={() => setSelectedOption(option)}
          />
        ))}
      </RadioGroup.Root>
    </>
  )
}
