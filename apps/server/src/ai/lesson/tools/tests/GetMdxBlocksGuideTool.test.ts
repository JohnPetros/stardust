import { mock, type Mock } from 'ts-jest-mocker'

import type { Mcp } from '@stardust/core/global/interfaces'

import { GetMdxBlocksGuideTool } from '../getMdxBlocksGuideTool'

describe('Get Mdx Blocks Guide Tool', () => {
  let mcp: Mock<Mcp>
  let tool: GetMdxBlocksGuideTool

  beforeEach(() => {
    mcp = mock()
    tool = new GetMdxBlocksGuideTool()
  })

  it('should return a non-empty guide with the required documentation components and nesting rule', async () => {
    const response = await tool.handle(mcp)

    expect(response).toEqual({
      guide: expect.any(String),
    })
    expect(response.guide.trim().length).toBeGreaterThan(0)
    expect(response.guide).toContain('### Text')
    expect(response.guide).toContain('### Alert')
    expect(response.guide).toContain('### Quote')
    expect(response.guide).toContain('### Code')
    expect(response.guide).toContain('Nunca aninhe blocos de texto')
    expect(response.guide).toContain(
      'Nunca coloque `Text`, `Alert`, `Quote` ou `Code` dentro de',
    )
  })
})
