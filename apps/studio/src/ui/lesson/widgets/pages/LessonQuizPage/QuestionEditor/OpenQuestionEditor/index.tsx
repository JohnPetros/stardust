import type { OpenQuestion } from '@stardust/core/lesson/entities'

import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import { OpenQuestionEditorView } from './OpenQuestionEditorView'
import { useOpenQuestionEditor } from './useOpenQuestionEditor'

export const OpenQuestionEditor = () => {
  const { selectedQuestion, replaceSelectedQuestion } = useQuizContext()
  const question = selectedQuestion.value as OpenQuestion
  const {
    codeLines,
    handleStemInputChange,
    handlePictureInputChange,
    handleAddCodeLineText,
    handleAddCodeLineInput,
    handleCodeChange,
    handleCodeInputEnable,
    handleCodeInputDisabled,
    handleCodeLineTextChange,
    handleCodeLineInputChange,
    handleDeleteCodeLine,
    handleCodeLineIndentationChange,
    handleDragEnd,
    handleAddCodeLine,
  } = useOpenQuestionEditor(question, replaceSelectedQuestion)

  return (
    <OpenQuestionEditorView
      codeLines={codeLines}
      stem={question.stem.value}
      picture={question.picture}
      code={question.code}
      answers={question.answers.items}
      onStemChange={handleStemInputChange}
      onPictureChange={handlePictureInputChange}
      onAddCodeLineText={handleAddCodeLineText}
      onAddCodeLineInput={handleAddCodeLineInput}
      onCodeChange={handleCodeChange}
      onCodeInputEnable={handleCodeInputEnable}
      onCodeInputDisabled={handleCodeInputDisabled}
      onCodeLineTextChange={handleCodeLineTextChange}
      onCodeLineInputChange={handleCodeLineInputChange}
      onDeleteCodeLine={handleDeleteCodeLine}
      onCodeLineIndentationChange={handleCodeLineIndentationChange}
      onAddCodeLine={handleAddCodeLine}
      onDragEnd={handleDragEnd}
    />
  )
}
