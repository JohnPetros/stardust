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

  it('should return a non-empty guide with the updated formatting rules and examples', async () => {
    const response = await tool.handle(mcp)

    expect(response).toEqual({
      guide: expect.any(String),
    })
    expect(response.guide.trim().length).toBeGreaterThan(0)
    expect(response.guide).toContain('## Regras')
    expect(response.guide).toContain('Use texto markdown simples para explicações')
    expect(response.guide).toContain('`Code` é o único componente permitido')
    expect(response.guide).toContain('Não aninhe blocos `Code`')
    expect(response.guide).toContain('## Exemplos')
    expect(response.guide).toContain("var nome = 'Ítalo'")
    expect(response.guide).toContain('var numero = numero(entrada)')
  })
})
