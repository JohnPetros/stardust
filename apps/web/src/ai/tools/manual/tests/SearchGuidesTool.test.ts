import { mock, type Mock } from 'ts-jest-mocker'

import type { Mcp } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import type { StorageService } from '@stardust/core/storage/interfaces'

import { SearchGuidesTool } from '../SearchGuidesTool'

describe('Search Guides Tool', () => {
  let service: Mock<StorageService>
  let mcp: Mock<Mcp<{ query: string }>>
  let tool: ReturnType<typeof SearchGuidesTool>

  beforeEach(() => {
    service = mock<StorageService>()
    mcp = mock<Mcp<{ query: string }>>()
    tool = SearchGuidesTool(service)
  })

  it('should search embeddings using query from mcp input', async () => {
    const query = 'laços de repetição'
    const guides = ['Guia de For', 'Guia de While']

    mcp.getInput.mockReturnValue({ query })
    service.searchEmbeddings.mockResolvedValue(new RestResponse({ body: guides }))

    const result = await tool.handle(mcp)

    expect(mcp.getInput).toHaveBeenCalled()
    expect(service.searchEmbeddings).toHaveBeenCalledWith(
      expect.objectContaining({ value: query }),
      expect.objectContaining({ value: 10 }),
      expect.objectContaining({ value: 'guides' }),
    )
    expect(result).toEqual(guides)
  })

  it('should throw when embeddings search fails', async () => {
    mcp.getInput.mockReturnValue({ query: 'variáveis' })
    service.searchEmbeddings.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Storage service error' }),
    )

    await expect(tool.handle(mcp)).rejects.toThrow('Storage service error')
  })
})
