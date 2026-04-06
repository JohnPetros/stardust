import { mock, type Mock } from 'ts-jest-mocker'

import type { Mcp } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { GuidesFaker } from '@stardust/core/manual/entities/fakers'
import type { ManualService } from '@stardust/core/manual/interfaces'

import { GetMdxGuideTool } from '../GetMdxGuideTool'

describe('Get Mdx Guide Tool', () => {
  let service: Mock<ManualService>
  let mcp: Mock<Mcp<void>>
  let tool: ReturnType<typeof GetMdxGuideTool>

  beforeEach(() => {
    service = mock<ManualService>()
    mcp = mock<Mcp<void>>()
    tool = GetMdxGuideTool(service)
  })

  it('should fetch mdx guides and join contents', async () => {
    const guideA = GuidesFaker.fakeDto({ category: 'mdx', content: '# Guia A' })
    const guideB = GuidesFaker.fakeDto({ category: 'mdx', content: '# Guia B' })

    service.fetchGuidesByCategory.mockResolvedValue(
      new RestResponse({ body: [guideA, guideB] }),
    )

    const result = await tool.handle(mcp)

    expect(service.fetchGuidesByCategory).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'mdx' }),
    )
    expect(result).toBe('# Guia A\n# Guia B')
    expect(mcp.getInput).not.toHaveBeenCalled()
  })

  it('should throw when guides lookup fails', async () => {
    service.fetchGuidesByCategory.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Manual service error' }),
    )

    await expect(tool.handle(mcp)).rejects.toThrow('Manual service error')
  })
})
