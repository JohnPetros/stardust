import type { TextBlockDto } from '#global/dtos'
import type { RestResponse } from '#global/responses'
import type { QuestionDto } from '#lesson/dtos'

export interface LessonService {
  fetchQuestionsByStar(starId: string): Promise<RestResponse<QuestionDto[]>>
  fetchTextsBlocksByStar(starId: string): Promise<RestResponse<TextBlockDto[]>>
  fetchStarStory(starId: string): Promise<RestResponse<{ story: string }>>
}
