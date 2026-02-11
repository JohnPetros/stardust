import { z } from 'zod'
import { createTool } from '@mastra/core/tools'

import {
  challengeCategoriesSchema,
  challengeSchema,
} from '@stardust/validation/challenging/schemas'

import { supabase } from '@/database/supabase'
import { SupabaseChallengesRepository } from '@/database/supabase/repositories'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { TOOLS_DESCRIPTIONS } from '@/ai/constants'
import {
  GetAllChallengeCategoriesTool,
  GetChallengeProblemTool,
  PostChallengeTool,
} from '@/ai/challenging/tools'
import { MastraMcp } from '../MastraMcp'
import { UpstashCacheProvider } from '@/provision/cache/UpstashCacheProvider'

export class ChallengingToolset {
  static get postChallengingTool() {
    return createTool({
      id: 'post-challenging-tool',
      description: TOOLS_DESCRIPTIONS.postChallenge,
      inputSchema: challengeSchema.omit({ author: true }),
      outputSchema: z.void(),
      execute: async (input) => {
        const mcp = new MastraMcp(input)
        const repository = new SupabaseChallengesRepository(supabase)
        const broker = new InngestBroker()
        const tool = new PostChallengeTool(repository, broker)
        await tool.handle(mcp)
      },
    })
  }

  static get getChallengeProblemTool() {
    return createTool({
      id: 'get-challenge-problem-tool',
      description: TOOLS_DESCRIPTIONS.getChallengeProblem,
      inputSchema: z.void(),
      outputSchema: z.object({ problem: z.string() }),
      execute: async (input) => {
        const mcp = new MastraMcp(input)
        const cacheProvider = new UpstashCacheProvider()
        const tool = new GetChallengeProblemTool(cacheProvider)
        return await tool.handle(mcp)
      },
    })
  }

  static get getAllChallengeCategoriesTool() {
    return createTool({
      id: 'get-all-challenge-categories-tool',
      description: TOOLS_DESCRIPTIONS.getAllChallengeCategories,
      inputSchema: z.object({}),
      outputSchema: challengeCategoriesSchema,
      execute: async (input) => {
        const mcp = new MastraMcp(input)
        const repository = new SupabaseChallengesRepository(supabase)
        const tool = new GetAllChallengeCategoriesTool(repository)
        return await tool.handle(mcp)
      },
    })
  }
}
