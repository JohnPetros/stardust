import type { TextBlockDto } from '../../dtos'
import type { QuestionDto } from '../../../lesson/dtos'
import type { RestResponse } from '../../responses'

export interface ILessonService {
  fetchQuestionsByStar(starId: string): Promise<RestResponse<QuestionDto[]>>
  fetchTextsBlocksByStar(starId: string): Promise<RestResponse<TextBlockDto[]>>
  fetchStarStory(starId: string): Promise<RestResponse<{ story: string }>>
}
