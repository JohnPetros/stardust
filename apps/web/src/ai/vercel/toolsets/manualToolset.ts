import { tool as createTool } from 'ai'
import { z } from 'zod'

import { MANUAL_INSTRUCTIONS } from '@/ai/constants'
import { SearchGuidesTool } from '@/ai/tools/manual'
import { GetMdxGuideTool } from '@/ai/tools/manual/GetMdxGuideTool'
import { ManualService, StorageService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { VercelMcp } from '../VercelMcp'

export const manualToolset = {
  searchGuidesTool: createTool({
    description: MANUAL_INSTRUCTIONS.tools.searchGuides,
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'Uma palavra ou frase a ser pesquisada nos guias. Nunca forneça uma frase com mais de uma linha',
        ),
    }),
    execute: async (input) => {
      const restClient = await NextServerRestClient({ isCacheEnabled: false })
      const service = StorageService(restClient)
      const mcp = VercelMcp(input)
      const tool = SearchGuidesTool(service)
      return await tool.handle(mcp)
    },
  }),
}
