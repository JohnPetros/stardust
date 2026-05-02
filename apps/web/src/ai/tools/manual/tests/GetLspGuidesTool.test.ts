import { mock, type Mock } from 'ts-jest-mocker'

import type { Mcp } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { GuidesFaker } from '@stardust/core/manual/entities/fakers'
import type { ManualService } from '@stardust/core/manual/interfaces'

import { GetLspGuidesTool } from '../GetLspGuidesTool'

describe('Get LSP Guides Tool', () => {
  let service: Mock<ManualService>
  let mcp: Mock<Mcp<void>>
  let tool: ReturnType<typeof GetLspGuidesTool>

  beforeEach(() => {
    service = mock<ManualService>()
    mcp = mock<Mcp<void>>()
    tool = GetLspGuidesTool(service)
  })

  it('should fetch and concatenate lsp guides', async () => {
    const guideA = GuidesFaker.fakeDto({ category: 'lsp', content: 'Guia de variaveis' })
    const guideB = GuidesFaker.fakeDto({ category: 'lsp', content: 'Guia de lacos' })

    service.fetchGuidesByCategory.mockResolvedValue(
      new RestResponse({ body: [guideA, guideB] }),
    )

    const result = await tool.handle(mcp)

    expect(service.fetchGuidesByCategory).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'lsp' }),
    )
    expect(result).toBe('Guia de variaveis\nGuia de lacos')
    expect(mcp.getInput).not.toHaveBeenCalled()
  })

  it('should throw when lsp guides fetch fails', async () => {
    service.fetchGuidesByCategory.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Manual service error' }),
    )

    await expect(tool.handle(mcp)).rejects.toThrow('Manual service error')
  })
})
