import { SelectionQuestion } from '@stardust/core/lesson/entities'

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
  } = useSelectionQuestionEditor(question, replaceSelectedQuestion)

  console.log({ question })

  return (
    <SelectionQuestionEditorView
      stem={question.stem.value}
      picture={question.picture}
      options={question.options.items}
      answer={question.answer}
      onStemChange={handleStemInputChange}
      onPictureChange={handlePictureInputChange}
      onOptionRemove={handleOptionRemove}
      onAnswerChange={handleAnswerInputChange}
      onOptionAdd={handleOptionAdd}
      onOptionInputChange={handleOptionInputChange}
    />
  )
}
