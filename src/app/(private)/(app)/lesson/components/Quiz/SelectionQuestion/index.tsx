'use client'
import { useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { Stem } from '../Stem'
import { Option } from './Option'
import * as RadioGroup from '@radix-ui/react-radio-group'

import type { SelectionQuestion } from '@/types/question'

interface SelectionQuestionProps {
  data: SelectionQuestion
}

export function SelectionQuestion({
  data: { stem, options, code, answer },
}: SelectionQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerWrong },
  } = useLesson()
  const [selectedOption, setSelectedOption] = useState('')

  return (
    <>
      <Stem>{stem}</Stem>

      <RadioGroup.Root className="w-80 mt-20">
        {options.map((option) => (
          <Option
            label={option}
            isSelected={selectedOption === option}
            isAnswerWrong={isAnswerVerified && isAnswerWrong}
            isAnswerCorrect={
              isAnswerVerified && !isAnswerWrong && option === answer
            }
            onClick={() => {}}
          />
        ))}
      </RadioGroup.Root>
    </>
  )
}
