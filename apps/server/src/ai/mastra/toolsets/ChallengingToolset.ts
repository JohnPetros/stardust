import { z } from 'zod'
import { createTool } from '@mastra/core/tools'

import {
  challengeCategoriesSchema,
  challengeDraftSchema,
} from '@stardust/validation/challenging/schemas'
import { idSchema } from '@stardust/validation/global/schemas'

import { supabase } from '@/database/supabase'
import {
  SupabaseChallengesRepository,
  SupabaseChallengeSourcesRepository,
} from '@/database/supabase/repositories'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { TOOLS_DESCRIPTIONS } from '@/ai/constants'
import {
  GetAllChallengeCategoriesTool,
  GetChallengeProblemTool,
  GetNextChallengeSourceTool,
  PostChallengeTool,
} from '@/ai/challenging/tools'
import { MastraMcp } from '../MastraMcp'
import { UpstashCacheProvider } from '@/provision/cache/UpstashCacheProvider'

const challengeSourceDtoSchema = z.object({
  id: idSchema,
  url: z.string().url(),
  position: z.number(),
  additionalInstructions: z.string().nullable(),
  challenge: z
    .object({
      id: idSchema,
      title: z.string(),
      slug: z.string(),
    })
    .nullable()
    .optional(),
})

export class ChallengingToolset {
  static get postChallengingTool() {
    const postChallengeSchema = challengeDraftSchema.extend({
      challengeSourceId: idSchema.nullable().optional(),
    })

    return createTool({
      id: 'post-challenging-tool',
      description: TOOLS_DESCRIPTIONS.postChallenge,
      inputSchema: postChallengeSchema,
      outputSchema: z.void(),
      execute: async (input) => {
        const mcp = new MastraMcp({
          ...input,
          testCases: input.testCases.map((testCase) => ({
            ...testCase,
            inputs: JSON.parse(testCase.inputs),
            expectedOutput: JSON.parse(testCase.expectedOutput),
          })),
        })
        const challengesRepository = new SupabaseChallengesRepository(supabase)
        const challengeSourcesRepository = new SupabaseChallengeSourcesRepository(
          supabase,
        )
        const broker = new InngestBroker()
        const tool = new PostChallengeTool(
          challengesRepository,
          challengeSourcesRepository,
          broker,
        )
        await tool.handle(mcp)
      },
    })
  }

  static get getNextChallengeSourceTool() {
    return createTool({
      id: 'get-next-challenge-source-tool',
      description: TOOLS_DESCRIPTIONS.getNextChallengeSource,
      inputSchema: z.void(),
      outputSchema: challengeSourceDtoSchema,
      execute: async (input) => {
        const mcp = new MastraMcp(input)
        const repository = new SupabaseChallengeSourcesRepository(supabase)
        const tool = new GetNextChallengeSourceTool(repository)
        return await tool.handle(mcp)
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
