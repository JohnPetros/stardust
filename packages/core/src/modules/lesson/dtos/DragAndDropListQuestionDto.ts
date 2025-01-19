export type DragAndDropListQuestionDto = {
  id?: string
  type: 'drag-and-drop-list'
  statement: string
  picture: string
  items: Array<{
    position: number
    label: string
  }>
}
