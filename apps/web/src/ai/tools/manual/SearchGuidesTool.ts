import type { Tool } from '@stardust/core/global/interfaces'
import type { Mcp } from '@stardust/core/global/interfaces'
import { Integer, Text } from '@stardust/core/global/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { EmbeddingNamespace } from '@stardust/core/storage/structures'

type Input = {
  query: string
}

type Output = string[]

export const SearchGuidesTool = (service: StorageService): Tool<Input, Output> => {
  return {
    async handle(mcp: Mcp<Input>) {
      const { query } = mcp.getInput()
      const response = await service.searchEmbeddings(
        Text.create(query),
        Integer.create(3),
        EmbeddingNamespace.createAsGuides(),
      )
      if (response.isFailure) response.throwError()
      return response.body
    },
  }
}
