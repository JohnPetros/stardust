import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type {
  Controller,
  EmbeddingProvider,
  Http,
} from '@stardust/core/global/interfaces'
import { EditGuideContentUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  routeParams: {
    guideId: string
  }
  body: {
    guideContent: string
  }
}

export class EditGuideContentController implements Controller<Schema> {
  constructor(
    private readonly repository: GuidesRepository,
    private readonly embeddingProvider: EmbeddingProvider,
  ) {}

  async handle(http: Http<Schema>) {
    const { guideId } = http.getRouteParams()
    const { guideContent } = await http.getBody()
    const useCase = new EditGuideContentUseCase(this.repository, this.embeddingProvider)
    const response = await useCase.execute({ guideId, guideContent })
    return http.send(response)
  }
}
