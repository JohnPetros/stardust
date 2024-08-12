import type { QuestionCodeLineDTO } from './QuestionCodeLineDTO'

export type OpenQuestionDTO = {
  id?: string
  type: 'open'
  statement: string
  picture: string
  code?: string
  answers: string[]
  lines: QuestionCodeLineDTO[]
}
