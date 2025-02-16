export type SelectionQuestionDto = {
  id?: string
  type: 'selection'
  stem: string
  picture: string
  options: string[]
  answer: string
  code?: string
}
