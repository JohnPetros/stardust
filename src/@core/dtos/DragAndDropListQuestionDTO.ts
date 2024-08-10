export type DragAndDropListQuestionDTO = {
  id: string
  type: 'drag-and-drop-list'
  statement: string
  picture: string
  items: Array<{
    id: number
    label: string
  }>
}
