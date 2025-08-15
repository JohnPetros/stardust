import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import { Integer, SortableList, type Image, Text } from '@stardust/core/global/structures'
import type { DragAndDropListQuestion } from '@stardust/core/lesson/entities'

export function useDragAndDropListQuestionEditor(
  question: DragAndDropListQuestion,
  replaceSelectedQuestion: (question: DragAndDropListQuestion) => void,
) {
  function handleStemInputChange(stem: Text) {
    question.stem = stem
    replaceSelectedQuestion(question)
  }

  function handlePictureInputChange(picture: Image) {
    question.picture = picture
    replaceSelectedQuestion(question)
  }

  function handleItemAdd() {
    question.addItem('')
    replaceSelectedQuestion(question)
  }

  function handleItemRemove(itemIndex: number) {
    question.removeItem(itemIndex)
    replaceSelectedQuestion(question)
  }

  function handleItemLabelChange(itemOriginalPosition: number, itemLabel: string) {
    question.changeItemLabel(itemOriginalPosition, itemLabel)
    replaceSelectedQuestion(question)
  }

  function handleDragItemEnd(newItems: SortableItem<string>[]) {
    question.sortableList = SortableList.create(
      newItems.map((item, index) => ({
        originalPosition: Integer.create(index),
        label: Text.create(item.value),
      })),
      false,
    )
    replaceSelectedQuestion(question)
  }

  return {
    sortableItems: question.sortableList.orderedItems.map((item) => ({
      index: item.originalPosition.value,
      value: item.label.value,
    })),
    handleStemInputChange,
    handlePictureInputChange,
    handleItemAdd,
    handleItemRemove,
    handleItemLabelChange,
    handleDragItemEnd,
  }
}
