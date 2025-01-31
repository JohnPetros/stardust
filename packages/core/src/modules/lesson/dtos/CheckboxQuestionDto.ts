export type CheckboxQuestionDto = {
  id?: string
  type: 'checkbox'
  stem: string
  picture: string
  options: string[]
  correctOptions: string[]
  code?: string
}
