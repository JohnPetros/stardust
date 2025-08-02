import type { Id, Text } from '#global/domain/structures/index'
import type { RestResponse } from '#global/responses/RestResponse'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import type { QuestionDto } from '../domain/entities/dtos'

export interface LessonService {
  fetchQuestions(starId: Id): Promise<RestResponse<QuestionDto[]>>
  fetchTextsBlocks(starId: Id): Promise<RestResponse<TextBlockDto[]>>
  fetchStarStory(starId: Id): Promise<RestResponse<{ story: string }>>
  updateStory(starId: Id, story: Text): Promise<RestResponse<void>>
}
