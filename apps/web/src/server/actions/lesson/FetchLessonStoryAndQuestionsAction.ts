import type { TextBlockDto } from '@stardust/core/global/dtos'
import type { IAction, IActionServer, ILessonService } from '@stardust/core/interfaces'
import type { QuestionDto } from '@stardust/core/lesson/dtos'

type Request = {
  starId: string
}

type Response = {
  questions: QuestionDto[]
  textsBlocks: TextBlockDto[]
  story: string
}

export const FetchLessonStoryAndQuestionsAction = (
  service: ILessonService,
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { starId } = actionServer.getRequest()

      const questionsResponse = await service.fetchQuestionsByStar(starId)
      if (questionsResponse.isFailure) questionsResponse.throwError()
      const questions = questionsResponse.body

      console.log('questions', questions)

      const textsBlocksResponse = await service.fetchTextsBlocksByStar(starId)
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
