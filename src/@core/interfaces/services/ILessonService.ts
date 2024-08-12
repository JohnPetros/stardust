import type { TextBlockDTO, QuestionDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface ILessonService {
  fetchQuestionsByStar(starId: string): Promise<ServiceResponse<QuestionDTO[]>>
  fetchTextsBlocksByStar(starId: string): Promise<ServiceResponse<TextBlockDTO[]>>
}
