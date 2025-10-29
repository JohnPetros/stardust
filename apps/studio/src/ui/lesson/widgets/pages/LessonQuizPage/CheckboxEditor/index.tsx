import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import type { CheckboxQuestion } from '@stardust/core/lesson/entities'

import { useCheckboxQuestionEditor } from './useCheckboxQuestionEditor'
import { CheckboxQuestionEditorView } from './CheckboxEditorView'

export const CheckboxQuestionEditor = () => {
  const { selectedQuestion, replaceSelectedQuestion } = useQuizContext()
  const question = selectedQuestion.data as CheckboxQuestion
  const {
    handleOptionAdd,
    handleOptionRemove,
    handleOptionInputChange,
    handleStemInputChange,
    handlePictureInputChange,
    handleCorrectOptionChange,
    handleUndoQuestionChangeButtonClick,
    handleCodeInputChange,
    handleCodeInputEnable,
    handleCodeInputDisable,
  } = useCheckboxQuestionEditor(question, replaceSelectedQuestion)

  return (
    <CheckboxQuestionEditorView
      stem={question.stem.value}
      picture={question.picture}
      options={question.options}
      correctOptions={question.correctOptions}
      code={question.code}
      onCodeChange={handleCodeInputChange}
      onCodeInputEnable={handleCodeInputEnable}
      onCodeInputDisable={handleCodeInputDisable}
      onStemChange={handleStemInputChange}
      onPictureChange={handlePictureInputChange}
      onOptionRemove={handleOptionRemove}
      onCorrectOptionChange={handleCorrectOptionChange}
      onOptionAdd={handleOptionAdd}
      onOptionInputChange={handleOptionInputChange}
      onUndoQuestionChangeButtonClick={handleUndoQuestionChangeButtonClick}
    />
  )
}
