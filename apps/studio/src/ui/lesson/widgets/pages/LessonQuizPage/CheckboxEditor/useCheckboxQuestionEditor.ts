import { useState } from 'react'

import { Backup, type Image, type Text } from '@stardust/core/global/structures'
import type { CheckboxQuestion } from '@stardust/core/lesson/entities'

export function useCheckboxQuestionEditor(
  question: CheckboxQuestion,
  replaceSelectedQuestion: (question: CheckboxQuestion) => void,
) {
  const [questionBackup, setQuestionBackup] = useState<Backup<CheckboxQuestion>>(
    Backup.create([question]),
  )

  function handleStemInputChange(stem: Text) {
    question.stem = stem
    replaceSelectedQuestion(question)
  }

  function handlePictureInputChange(picture: Image) {
    question.picture = picture
    replaceSelectedQuestion(question)
  }

  function handleCodeInputChange(code: string) {
    question.code = code
    replaceSelectedQuestion(question)
  }

  function handleCodeInputEnable(defaultCode: string) {
    question.code = defaultCode
    replaceSelectedQuestion(question)
  }

  function handleCodeInputDisable() {
    question.removeCode()
    replaceSelectedQuestion(question)
  }

  function handleOptionAdd() {
    question.addOption('')
    replaceSelectedQuestion(question)
  }

  function handleOptionRemove(optionIndex: number) {
    question.removeOption(optionIndex)
    replaceSelectedQuestion(question)
  }

  function handleOptionInputChange(optionIndex: number, option: string) {
    question.changeOption(optionIndex, option)
    replaceSelectedQuestion(question)
  }

  function handleCorrectOptionChange(option: string) {
    question.changeCorrectOption(option)
    replaceSelectedQuestion(question)
  }

  function handleUndoQuestionChangeButtonClick() {
    if (questionBackup.lastState) {
      replaceSelectedQuestion(questionBackup.lastState)
      setQuestionBackup(questionBackup.undo())
    }
  }

  return {
    handleStemInputChange,
    handlePictureInputChange,
    handleOptionRemove,
    handleOptionAdd,
    handleOptionInputChange,
    handleCorrectOptionChange,
    handleCodeInputChange,
    handleCodeInputDisable,
    handleCodeInputEnable,
    handleUndoQuestionChangeButtonClick,
  }
}
