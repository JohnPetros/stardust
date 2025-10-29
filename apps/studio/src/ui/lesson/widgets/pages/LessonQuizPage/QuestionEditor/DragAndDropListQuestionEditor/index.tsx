import type { DragAndDropListQuestion } from '@stardust/core/lesson/entities'

import { DragAndDropListQuestionEditorView } from './DragAndDropListQuestionEditorView'
import { useDragAndDropListQuestionEditor } from './useDragAndDropListQuestionEditor'
import { useQuizContext } from '@/ui/global/hooks/useQuizContext'

export const DragAndDropListQuestionEditor = () => {
  const { selectedQuestion, replaceSelectedQuestion } = useQuizContext()
  const question = selectedQuestion.data as DragAndDropListQuestion
  const {
    sortableItems,
    handleItemAdd,
    handleItemRemove,
    handleItemLabelChange,
    handleStemInputChange,
    handlePictureInputChange,
    handleDragItemEnd,
  } = useDragAndDropListQuestionEditor(question, replaceSelectedQuestion)

  return (
    <DragAndDropListQuestionEditorView
      stem={question.stem.value}
      picture={question.picture}
      items={sortableItems}
      onItemAdd={handleItemAdd}
      onItemRemove={handleItemRemove}
      onItemLabelChange={handleItemLabelChange}
      onStemChange={handleStemInputChange}
      onPictureChange={handlePictureInputChange}
      onDragItemEnd={handleDragItemEnd}
    />
  )
}
