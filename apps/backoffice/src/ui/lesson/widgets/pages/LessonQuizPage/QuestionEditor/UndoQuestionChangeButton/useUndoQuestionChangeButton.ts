import { useEffect, useState } from 'react'

import { Backup } from '@stardust/core/global/structures'
import type { Question } from '@stardust/core/lesson/abstracts'

type Params = {
  question: Question
  isQuestionSaved: boolean
  replaceSelectedQuestion: (question: Question) => void
}

export function useUndoQuestionChangeButton({
  question,
  isQuestionSaved,
  replaceSelectedQuestion,
}: Params) {
  const [questionBackup, setQuestionBackup] = useState<Backup<Question>>(
    Backup.create([question]),
  )

  function handleClick() {
    if (questionBackup.isEmpty.isFalse) {
      const question = questionBackup.lastState
      replaceSelectedQuestion(question)
      setQuestionBackup(questionBackup)
    }
  }

  useEffect(() => {
    if (isQuestionSaved) {
      alert('isQuestionSaved')
      setQuestionBackup(Backup.create([question]))
    }
  }, [isQuestionSaved, question])

  return {
    handleClick,
  }
}
