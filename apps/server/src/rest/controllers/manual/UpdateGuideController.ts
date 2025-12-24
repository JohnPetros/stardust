import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateGuideUseCase } from '@stardust/core/manual/use-cases'
import type { GuideDto } from '@stardust/core/manual/entities/dtos'

type Schema = {
  routeParams: {
    guideId: string
  }
  body: GuideDto
}

export class UpdateGuideController implements Controller<Schema> {
  constructor(private readonly repository: GuidesRepository) {}

  async handle(http: Http<Schema>) {
    const { guideId } = http.getRouteParams()
    const guideDto = await http.getBody()
    const useCase = new UpdateGuideUseCase(this.repository)
    const response = await useCase.execute({
      guideDto: {
        ...guideDto,
        id: guideId,
      },
    })
    return http.send(response)
  }
}
