import type { Image, Text } from '@stardust/core/global/structures'
import type { QuestionCodeLine } from '@stardust/core/lesson/structures'

import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import type { DragAndDropQuestion } from '@stardust/core/lesson/entities'

export const useDragAndDropQuestionEditor = (
  question: DragAndDropQuestion,
  replaceSelectedQuestion: (question: DragAndDropQuestion) => void,
) => {
  function handleStemInputChange(stem: Text) {
    question.stem = stem
    replaceSelectedQuestion(question)
  }

  function handlePictureInputChange(picture: Image) {
    question.picture = picture
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

  function handleCodeLineTextChange(lineNumber: number, text: string, textIndex: number) {
    question.changeCodeLineText(lineNumber, text, textIndex)
    replaceSelectedQuestion(question)
  }

  function handleCodeLineInputChange(input: string, inputIndex: number) {
    question.changeCorrectItem(input, inputIndex)
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

  function handleAddItem() {
    question.addDragDropItem()
    replaceSelectedQuestion(question)
  }

  function handleRemoveItem(itemIndex: number) {
    question.removeDragDropItem(itemIndex)
    replaceSelectedQuestion(question)
  }

  function handleItemChange(itemIndex: number, itemLabel: string) {
    question.changeDragDropItem(itemIndex, itemLabel)
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
    handleCodeLineTextChange,
    handleCodeLineInputChange,
    handleRemoveCodeLine,
    handleCodeLineIndentationChange,
    handleAddCodeLine,
    handleRemoveCodeLineBlock,
    handleReplaceCodeLineBlockWithText,
    handleReplaceCodeLineBlockWithInput,
    handleDragEnd,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
  }
}
