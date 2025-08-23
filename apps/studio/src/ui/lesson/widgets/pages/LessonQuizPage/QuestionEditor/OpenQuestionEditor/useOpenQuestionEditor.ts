import type { OpenQuestion } from '@stardust/core/lesson/entities'
import type { Image, Text } from '@stardust/core/global/structures'
import type { QuestionCodeLine } from '@stardust/core/lesson/structures'

import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'

export const useOpenQuestionEditor = (
  question: OpenQuestion,
  replaceSelectedQuestion: (question: OpenQuestion) => void,
) => {
  function handleStemInputChange(stem: Text) {
    question.stem = stem
    replaceSelectedQuestion(question)
  }

  function handlePictureInputChange(picture: Image) {
    question.picture = picture
    replaceSelectedQuestion(question)
  }

  function handleCodeChange(code: string) {
    question.code = code
    replaceSelectedQuestion(question)
  }

  function handleCodeInputEnable(defaultCode: string) {
    question.code = defaultCode
    replaceSelectedQuestion(question)
  }

  function handleCodeInputDisabled() {
    question.removeCode()
    replaceSelectedQuestion(question)
  }

  function handleAddCodeLine() {
    question.addCodeLine()
    replaceSelectedQuestion(question)
  }

  function handleAddCodeLineText(lineNumber: number, codeLineTextIndex: number) {
    question.addCodeLineText(lineNumber, codeLineTextIndex)
    replaceSelectedQuestion(question)
  }

  function handleAddCodeLineInput(lineNumber: number, codeLineInputIndex: number) {
    question.addCodeLineInput(lineNumber, codeLineInputIndex)
    replaceSelectedQuestion(question)
  }

  function handleAnswerChange(answer: string, answerIndex: number) {
    question.changeAnswer(answer, answerIndex)
    replaceSelectedQuestion(question)
  }

  function handleCodeLineTextChange(lineNumber: number, text: string, textIndex: number) {
    question.changeCodeLineText(lineNumber, text, textIndex)
    replaceSelectedQuestion(question)
  }

  function handleCodeLineInputChange(input: string, inputIndex: number) {
    question.changeAnswer(input, inputIndex)
    replaceSelectedQuestion(question)
  }

  function handleRemoveCodeLine(lineNumber: number) {
    question.removeCodeLine(lineNumber)
    replaceSelectedQuestion(question)
  }

  function handleRemoveCodeLineBlock(lineNumber: number, blockIndex: number) {
    question.removeCodeLineBlock(lineNumber, blockIndex)
    replaceSelectedQuestion(question)
  }

  function handleCodeLineIndentationChange(lineNumber: number, indentation: number) {
    question.changeCodeLineIndentation(lineNumber, indentation)
    replaceSelectedQuestion(question)
  }

  function handleReplaceCodeLineBlockWithText(lineNumber: number, blockIndex: number) {
    question.replaceCodeLineBlockWithText(lineNumber, blockIndex)
    replaceSelectedQuestion(question)
  }

  function handleReplaceCodeLineBlockWithInput(lineNumber: number, blockIndex: number) {
    question.replaceCodeLineBlockWithInput(lineNumber, blockIndex)
    replaceSelectedQuestion(question)
  }

  function handleDragEnd(newItems: SortableItem<QuestionCodeLine>[]) {
    question.codeLines = newItems.map((item, index) => item.value.changeNumber(index))
    replaceSelectedQuestion(question)
  }

  return {
    codeLines: question.codeLines.map((line) => ({
      index: line.number.value,
      value: line,
    })),
    handleStemInputChange,
    handlePictureInputChange,
    handleAddCodeLineText,
    handleAddCodeLineInput,
    handleAnswerChange,
    handleCodeChange,
    handleCodeInputEnable,
    handleCodeInputDisabled,
    handleCodeLineTextChange,
    handleCodeLineInputChange,
    handleRemoveCodeLine,
    handleCodeLineIndentationChange,
    handleAddCodeLine,
    handleRemoveCodeLineBlock,
    handleReplaceCodeLineBlockWithText,
    handleReplaceCodeLineBlockWithInput,
    handleDragEnd,
  }
}
