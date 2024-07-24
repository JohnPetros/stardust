export type OpenQuestionDTO = {
  type: 'open'
  title: string
  picture: string
  code?: string
  answers: string[]
  lines: {
    number: number
    texts: string[]
    indentation: number
  }
}
