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
    handleRemoveCodeLine,
    handleCodeLineIndentationChange,
    handleDragEnd,
    handleAddCodeLine,
    handleRemoveCodeLineBlock,
    handleReplaceCodeLineBlockWithText,
    handleReplaceCodeLineBlockWithInput,
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
      onRemoveCodeLine={handleRemoveCodeLine}
      onCodeLineIndentationChange={handleCodeLineIndentationChange}
      onRemoveCodeLineBlock={handleRemoveCodeLineBlock}
      onAddCodeLine={handleAddCodeLine}
      onReplaceCodeLineBlockWithText={handleReplaceCodeLineBlockWithText}
      onReplaceCodeLineBlockWithInput={handleReplaceCodeLineBlockWithInput}
      onDragEnd={handleDragEnd}
    />
  )
}
