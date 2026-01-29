import { tool as createTool } from 'ai'
import { z } from 'zod'

import { CHALLENGING_PROMPTS } from '@/ai/constants/challenging-prompts'
import { GetChallengeDescriptionTool } from '@/ai/tools/challenging'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ChallengingService } from '@/rest/services'
import { VercelMcp } from '../VercelMcp'
import { idSchema } from '@stardust/validation/global/schemas'

export const challengingToolset = {
  getChallengeDescriptionTool: createTool({
    description: CHALLENGING_PROMPTS.tools.getChallengeDescription,
    inputSchema: z.object({
      challengeId: idSchema.describe('Id do desafio'),
    }),
    execute: async (input) => {
      const restClient = await NextServerRestClient()
      const service = ChallengingService(restClient)
      const mcp = VercelMcp(input)
      const tool = GetChallengeDescriptionTool(service)
      return await tool.handle(mcp)
    },
  }),
}
