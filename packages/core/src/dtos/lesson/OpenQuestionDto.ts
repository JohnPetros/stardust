import type { QuestionCodeLineDto } from './QuestionCodeLineDto'

export type OpenQuestionDto = {
  id?: string
  type: 'open'
  statement: string
  picture: string
  code?: string
  answers: string[]
  lines: QuestionCodeLineDto[]
}
