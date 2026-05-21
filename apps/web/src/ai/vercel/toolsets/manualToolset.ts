import { tool as createTool } from 'ai'
import { z } from 'zod'

import { MANUAL_INSTRUCTIONS } from '@/ai/constants'
import { GetLspGuidesTool } from '@/ai/tools/manual'
import { ManualService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { VercelMcp } from '../VercelMcp'

export const manualToolset = {
  getLspGuidesTool: createTool({
    description: MANUAL_INSTRUCTIONS.tools.getLspGuides,
    inputSchema: z.object({}),
    outputSchema: z.object({
      content: z.string().describe('Guias de LSP'),
    }),
    execute: async (input) => {
      const restClient = await NextServerRestClient({ isCacheEnabled: false })
      const service = ManualService(restClient)
      const mcp = VercelMcp(input)
      const tool = GetLspGuidesTool(service)
      return {
        content: await tool.handle(mcp),
      }
    },
  }),
}
