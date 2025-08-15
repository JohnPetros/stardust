import type { Question } from '@stardust/core/lesson/abstracts'
import { memo } from 'react'

import { UndoQuestionChangeButtonView } from './UndoQuestionChangeButtonView'
import { useUndoQuestionChangeButton } from './useUndoQuestionChangeButton'

type Props = {
  question: Question
  isQuestionSaved: boolean
  replaceSelectedQuestion: (question: Question) => void
}

export const UndoQuestionChangeButton = ({
  question,
  isQuestionSaved,
  replaceSelectedQuestion,
}: Props) => {
  const { handleClick } = useUndoQuestionChangeButton({
    question,
    isQuestionSaved,
    replaceSelectedQuestion,
  })
  return <UndoQuestionChangeButtonView onClick={handleClick} />
}
