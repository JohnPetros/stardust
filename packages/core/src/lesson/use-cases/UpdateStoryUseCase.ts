import type { UseCase } from '#global/interfaces/UseCase'
import { Id, Text } from '#global/domain/structures/index'
import type { StoriesRepository } from '../interfaces/StoriesRepository'

type Request = {
  starId: string
  story: string
}

type Response = Promise<string>

export class UpdateStoryUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StoriesRepository) {}

  async execute(request: Request) {
    const story = Text.create(request.story)
    await this.repository.update(story, Id.create(request.starId))
    return story.value
  }
}
