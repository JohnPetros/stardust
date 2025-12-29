import { tool as createTool } from 'ai'
import { z } from 'zod'

import { GetMdxGuideTool } from '@/ai/tools/manual/GetMdxGuideTool'
import { ManualService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { VercelMcp } from '../VercelMcp'
import { MANUAL_PROMPTS } from '@/ai/constants'

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
}
