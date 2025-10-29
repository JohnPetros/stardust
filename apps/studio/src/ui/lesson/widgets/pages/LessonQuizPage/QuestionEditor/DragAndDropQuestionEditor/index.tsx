import type { DragAndDropQuestion } from '@stardust/core/lesson/entities'

import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import { DragAndDropQuestionEditorView } from './DragAndDropQuestionEditorView'
import { useDragAndDropQuestionEditor } from './useDragAndDropQuestionEditor'

export const DragAndDropQuestionEditor = () => {
  const { selectedQuestion, replaceSelectedQuestion } = useQuizContext()
  const question = selectedQuestion.data as DragAndDropQuestion
  const {
    codeLines,
    handleStemInputChange,
    handlePictureInputChange,
    handleAddCodeLineText,
    handleAddCodeLineInput,
    handleCodeLineTextChange,
    handleCodeLineInputChange,
    handleRemoveCodeLine,
    handleCodeLineIndentationChange,
    handleDragEnd,
    handleAddCodeLine,
    handleRemoveCodeLineBlock,
    handleReplaceCodeLineBlockWithText,
    handleReplaceCodeLineBlockWithInput,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
  } = useDragAndDropQuestionEditor(question, replaceSelectedQuestion)

  return (
    <DragAndDropQuestionEditorView
      codeLines={codeLines}
      stem={question.stem.value}
      correctItems={question.correctItems.items}
      dragAndDropItems={question.dragAndDrop.items.map((item) => item.label.value)}
      picture={question.picture}
      onStemChange={handleStemInputChange}
      onPictureChange={handlePictureInputChange}
      onAddCodeLineText={handleAddCodeLineText}
      onAddCodeLineInput={handleAddCodeLineInput}
      onCodeLineTextChange={handleCodeLineTextChange}
      onCodeLineInputChange={handleCodeLineInputChange}
      onRemoveCodeLine={handleRemoveCodeLine}
      onCodeLineIndentationChange={handleCodeLineIndentationChange}
      onRemoveCodeLineBlock={handleRemoveCodeLineBlock}
      onAddCodeLine={handleAddCodeLine}
      onReplaceCodeLineBlockWithText={handleReplaceCodeLineBlockWithText}
      onReplaceCodeLineBlockWithInput={handleReplaceCodeLineBlockWithInput}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onItemChange={handleItemChange}
      onDragEnd={handleDragEnd}
    />
  )
}
