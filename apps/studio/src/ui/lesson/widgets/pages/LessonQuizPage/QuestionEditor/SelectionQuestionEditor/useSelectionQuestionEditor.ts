import type { Image, Text } from '@stardust/core/global/structures'
import type { SelectionQuestion } from '@stardust/core/lesson/entities'

export function useSelectionQuestionEditor(
  question: SelectionQuestion,
  replaceSelectedQuestion: (question: SelectionQuestion) => void,
) {
  function handleStemInputChange(stem: Text) {
    question.stem = stem
    replaceSelectedQuestion(question)
  }

  function handlePictureInputChange(picture: Image) {
    question.picture = picture
    replaceSelectedQuestion(question)
  }

  function handleAnswerInputChange(answer: string) {
    question.answer = answer
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

  return {
    handleStemInputChange,
    handlePictureInputChange,
    handleAnswerInputChange,
    handleOptionAdd,
    handleOptionRemove,
    handleOptionInputChange,
  }
}
