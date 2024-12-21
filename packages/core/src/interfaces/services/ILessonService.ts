import type { TextBlockDto } from '#dtos'
import type { QuestionDto } from '#dtos/lesson'
import type { ApiResponse } from '../../responses'

export interface ILessonService {
  fetchQuestionsByStar(starId: string): Promise<ApiResponse<QuestionDto[]>>
  fetchTextsBlocksByStar(starId: string): Promise<ApiResponse<TextBlockDto[]>>
}
