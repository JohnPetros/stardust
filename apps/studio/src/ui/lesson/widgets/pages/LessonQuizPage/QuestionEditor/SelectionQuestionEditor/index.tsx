import type { SelectionQuestion } from '@stardust/core/lesson/entities'

import { SelectionQuestionEditorView } from './SelectionQuestionEditorView'
import { useSelectionQuestionEditor } from './useSelectionQuestionEditor'
import { useQuizContext } from '@/ui/global/hooks/useQuizContext'

export const SelectionQuestionEditor = () => {
  const { selectedQuestion, replaceSelectedQuestion } = useQuizContext()
  const question = selectedQuestion.value as SelectionQuestion
  const {
    handleAnswerInputChange,
    handleOptionAdd,
    handleOptionRemove,
    handleOptionInputChange,
    handleStemInputChange,
    handlePictureInputChange,
    handleCodeInputChange,
    handleCodeInputDisabled,
    handleCodeInputEnable,
  } = useSelectionQuestionEditor(question, replaceSelectedQuestion)

  return (
    <SelectionQuestionEditorView
      stem={question.stem.value}
      picture={question.picture}
      options={question.options.items}
      answer={question.answer}
      code={question.code}
      onCodeChange={handleCodeInputChange}
      onCodeInputEnable={handleCodeInputEnable}
      onCodeInputDisabled={handleCodeInputDisabled}
      onStemChange={handleStemInputChange}
      onPictureChange={handlePictureInputChange}
      onOptionRemove={handleOptionRemove}
      onAnswerChange={handleAnswerInputChange}
      onOptionAdd={handleOptionAdd}
      onOptionInputChange={handleOptionInputChange}
    />
  )
}
