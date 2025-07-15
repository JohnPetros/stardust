import type { Action, Call } from '@stardust/core/global/interfaces'
import type { LessonService } from '@stardust/core/lesson/interfaces'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import { Id } from '@stardust/core/global/structures'

type Request = {
  starId: string
}

type Response = {
  questions: QuestionDto[]
  textsBlocks: TextBlockDto[]
  story: string
}

export const FetchLessonStoryAndQuestionsAction = (
  service: LessonService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { starId: starIdValue } = call.getRequest()
      const starId = Id.create(starIdValue)

      const questionsResponse = await service.fetchQuestions(starId)
      if (questionsResponse.isFailure) questionsResponse.throwError()
      const questions = questionsResponse.body

      const textsBlocksResponse = await service.fetchTextsBlocks(starId)
      if (textsBlocksResponse.isFailure) textsBlocksResponse.throwError()
      const textsBlocks = textsBlocksResponse.body

      const storyResponse = await service.fetchStarStory(starId)
      if (storyResponse.isFailure) storyResponse.throwError()
      const story = storyResponse.body.story

      return {
        questions,
        textsBlocks,
        story,
      }
    },
  }
}
