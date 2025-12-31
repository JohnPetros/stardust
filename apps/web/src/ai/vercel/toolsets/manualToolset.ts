import { tool as createTool } from 'ai'
import { z } from 'zod'

import { MANUAL_PROMPTS } from '@/ai/constants'
import { SearchGuidesTool } from '@/ai/tools/manual'
import { GetMdxGuideTool } from '@/ai/tools/manual/GetMdxGuideTool'
import { ManualService, StorageService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { VercelMcp } from '../VercelMcp'

export const manualToolset = {
  getMdxGuideTool: createTool({
    description: MANUAL_PROMPTS.tools.getMdxGuide,
    inputSchema: z.object({
      category: z.enum(['mdx']).describe('A categoria do guia, deve ser sempre "mdx"'),
    }),
    execute: async () => {
      const restClient = await NextServerRestClient()
      const service = ManualService(restClient)
      const mcp = VercelMcp(undefined)
      const tool = GetMdxGuideTool(service)
      return await tool.handle(mcp)
    },
  }),
  searchGuidesTool: createTool({
    description: MANUAL_PROMPTS.tools.searchGuides,
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'Uma palavra ou frase a ser pesquisada nos guias. Nunca forneça uma frase com mais de uma linha',
        ),
    }),
    execute: async (input) => {
      const restClient = await NextServerRestClient()
      const service = StorageService(restClient)
      const mcp = VercelMcp(input)
      const tool = SearchGuidesTool(service)
      return await tool.handle(mcp)
    },
  }),
}
