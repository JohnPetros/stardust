export type SelectionQuestionDto = {
  id?: string
  type: 'selection'
  statement: string
  picture: string
  options: string[]
  answer: string
  position: number
  code?: string
}
