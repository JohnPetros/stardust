import type { TextBlockDto } from '#global/dtos'
import type { QuestionDto } from '../../modules/lesson/dtos'
import type { ApiResponse } from '../../responses'

export interface ILessonService {
  fetchQuestionsByStar(starId: string): Promise<ApiResponse<QuestionDto[]>>
  fetchTextsBlocksByStar(starId: string): Promise<ApiResponse<TextBlockDto[]>>
  fetchStarStory(starId: string): Promise<ApiResponse<{ story: string }>>
}
