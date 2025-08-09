import type { UseCase } from '#global/interfaces/UseCase'
import type { Question } from '../domain/abstracts'
import type { QuestionDto } from '../domain/entities/dtos'
import type { QuestionsRepository } from '../interfaces'
import { Id } from '#global/domain/structures/Id'
import { QuestionFactory } from '../domain/factories/QuestionFactory'

type Request = {
  questions: QuestionDto[]
  starId: string
}

type Response = Promise<QuestionDto[]>

export class UpdateQuestionsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: QuestionsRepository) {}

  async execute(request: Request) {
    const questions: Question[] = request.questions.map(QuestionFactory.produce)
    await this.repository.updateMany(questions, Id.create(request.starId))
    return questions.map((question) => question.dto)
  }
}
