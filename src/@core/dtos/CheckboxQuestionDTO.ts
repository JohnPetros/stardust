export type CheckboxQuestionDTO = {
  id?: string
  type: 'checkbox'
  statement: string
  picture: string
  options: string[]
  correctOptions: string[]
  code?: string
}
