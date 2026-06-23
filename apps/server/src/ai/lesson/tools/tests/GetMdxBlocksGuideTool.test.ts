import { mock, type Mock } from 'ts-jest-mocker'

import type { Mcp } from '@stardust/core/global/interfaces'

import { GetMdxBlocksGuideTool } from '../GetMdxBlocksGuideTool'

describe('Get Mdx Blocks Guide Tool', () => {
  let mcp: Mock<Mcp>
  let tool: GetMdxBlocksGuideTool

  beforeEach(() => {
    mcp = mock()
    tool = new GetMdxBlocksGuideTool()
  })

  it('should return a non-empty guide with the required documentation components and global rules', async () => {
    const response = await tool.handle(mcp)

    expect(response).toEqual({
      guide: expect.any(String),
    })
    expect(response.guide.trim().length).toBeGreaterThan(0)
    expect(response.guide).toContain('## Documentation Components Guide')
    expect(response.guide).toContain('### Text')
    expect(response.guide).toContain('### Alert')
    expect(response.guide).toContain('### Quote')
    expect(response.guide).toContain('### Code')
    expect(response.guide).toContain('### 1. Never nest text blocks')
    expect(response.guide).toContain(
      'Never place `Text`, `Alert`, `Quote`, or `Code` inside another',
    )
    expect(response.guide).toContain('### 2. Never use bold with **...**')
    expect(response.guide).toContain('### 3. Never use Code for short references')
  })
})
