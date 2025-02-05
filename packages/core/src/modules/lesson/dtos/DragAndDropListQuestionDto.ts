export type DragAndDropListQuestionDto = {
  id?: string
  type: 'drag-and-drop-list'
  stem: string
  picture: string
  items: Array<{
    position: number
    label: string
    indentation: number
  }>
}
