import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import type { RestResponse } from '#global/responses/RestResponse'
import type { QuestionDto } from '../domain/entities/dtos'

export interface LessonService {
  fetchQuestionsByStar(starId: string): Promise<RestResponse<QuestionDto[]>>
  fetchTextsBlocksByStar(starId: string): Promise<RestResponse<TextBlockDto[]>>
  fetchStarStory(starId: string): Promise<RestResponse<{ story: string }>>
}
