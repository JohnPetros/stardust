import type { Tool } from '@stardust/core/global/interfaces'
import type { Mcp } from '@stardust/core/global/interfaces'
import type { ManualService } from '@stardust/core/manual/interfaces'
import { GuideCategory } from '@stardust/core/manual/structures'

export const GetMdxGuideTool = (service: ManualService): Tool<void, string> => {
  return {
    async handle(_: Mcp<void>) {
      const response = await service.fetchGuidesByCategory(GuideCategory.createAsMdx())
      if (response.isFailure) response.throwError()
      return response.body.map((guide) => guide.content).join('\n')
    },
  }
}
