import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { QuestionsRepository } from '@stardust/core/lesson/interfaces'
import { UpdateQuestionsUseCase } from '@stardust/core/lesson/use-cases'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    questions: QuestionDto[]
  }
}

export class UpdateQuestionsController implements Controller<Schema> {
  constructor(private readonly repository: QuestionsRepository) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const { questions } = await http.getBody()
    const useCase = new UpdateQuestionsUseCase(this.repository)
    const response = await useCase.execute({ questions, starId })
    return http.send(response)
  }
}
