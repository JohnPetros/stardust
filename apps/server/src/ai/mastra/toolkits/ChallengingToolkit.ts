import z from 'zod'
import { createTool } from '@mastra/core/tools'

import { supabase } from '@/database/supabase'
import {
  SupabaseChallengesRepository,
  SupabaseChallengeSourcesRepository,
  SupabaseUsersRepository,
} from '@/database/supabase/repositories'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { TOOLS_DESCRIPTIONS } from '@/ai/challenging/constants'
import {
  GetAllChallengeCategoriesTool,
  GetChallengeCreationInstructionsTool,
  GetChallengeProblemTool,
  GetNextChallengeSourceTool,
  ListChallengesTool,
  DeleteChallengeTool,
  PostChallengeTool,
  UpdateChallengeTool,
} from '@/ai/challenging/tools'
import { MastraMcp } from '../MastraMcp'
import { UpstashCacheProvider } from '@/provision/cache/UpstashCacheProvider'
import {
  idSchema,
  idsListSchema,
  itemsPerPageSchema,
  listingOrderSchema,
  nameSchema,
  pageSchema,
  searchSchema,
} from '@stardust/validation/global/schemas'
import {
  challengeCompletionStatusSchema,
  challengeDifficultyLevelSchema,
  challengeIsNewStatusSchema,
  challengeSchema,
} from '@stardust/validation/challenging/schemas'

export class ChallengingToolkit {
  static get postChallengingTool() {
    return createTool({
      id: 'post-challenging-tool',
      description: TOOLS_DESCRIPTIONS.postChallenge,
      inputSchema: challengeSchema.omit({ author: true, isPublic: true }).extend({
        challengeSourceId: idSchema.nullable().optional(),
      }),
      outputSchema: z.void(),
      execute: async (input, context) => {
        const mcp = new MastraMcp(input, context)
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

  static get getChallengeCreationInstructionsTool() {
    return createTool({
      id: 'get-challenge-creation-instructions-tool',
      description: TOOLS_DESCRIPTIONS.getChallengeCreationInstructions,
      outputSchema: z.object({
        instructions: z.string(),
      }),
      execute: async (input, context) => {
        const mcp = new MastraMcp(input, context)
        const tool = new GetChallengeCreationInstructionsTool()
        return await tool.handle(mcp)
      },
    })
  }

  static get updateChallengeTool() {
    return createTool({
      id: 'update-challenge-tool',
      description: TOOLS_DESCRIPTIONS.updateChallenge,
      inputSchema: challengeSchema.omit({ author: true }).extend({
        challengeId: idSchema,
      }),
      execute: async (input, context) => {
        const mcp = new MastraMcp(input, context)
        const repository = new SupabaseChallengesRepository(supabase)
        const tool = new UpdateChallengeTool(repository)
        await tool.handle(mcp)
      },
    })
  }

  static get deleteChallengeTool() {
    return createTool({
      id: 'delete-challenge-tool',
      description: TOOLS_DESCRIPTIONS.deleteChallenge,
      inputSchema: z.object({
        challengeId: idSchema,
        confirmacao: z.literal(true),
      }),
      outputSchema: z.void(),
      execute: async (input, context) => {
        const mcp = new MastraMcp(input, context)
        const repository = new SupabaseChallengesRepository(supabase)
        const tool = new DeleteChallengeTool(repository)
        await tool.handle(mcp)
      },
    })
  }

  static get getNextChallengeSourceTool() {
    return createTool({
      id: 'get-next-challenge-source-tool',
      description: TOOLS_DESCRIPTIONS.getNextChallengeSource,
      outputSchema: z.object({
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
      }),
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
      outputSchema: z.object({
        items: z.array(z.object({ name: nameSchema })),
      }),
      execute: async (input) => {
        const mcp = new MastraMcp(input)
        const repository = new SupabaseChallengesRepository(supabase)
        const tool = new GetAllChallengeCategoriesTool(repository)
        return {
          items: await tool.handle(mcp),
        }
      },
    })
  }

  static get listChallengesTool() {
    return createTool({
      id: 'list-challenges-tool',
      description: TOOLS_DESCRIPTIONS.listChallenges,
      inputSchema: z.object({
        page: pageSchema.default(1),
        itemsPerPage: itemsPerPageSchema.default(10),
        title: searchSchema,
        categoriesIds: idsListSchema,
        difficulty: challengeDifficultyLevelSchema,
        upvotesCountOrder: listingOrderSchema,
        downvoteCountOrder: listingOrderSchema,
        completionCountOrder: listingOrderSchema,
        postingOrder: listingOrderSchema,
        completionStatus: challengeCompletionStatusSchema,
        isNewStatus: challengeIsNewStatusSchema.default('all'),
      }),
      outputSchema: z.object({
        items: z.array(z.custom<Record<string, unknown>>()),
        totalItemsCount: z.number(),
        page: z.number(),
        itemsPerPage: z.number(),
        totalPagesCount: z.number(),
      }),
      execute: async (input, context) => {
        const mcp = new MastraMcp(input, context)
        const challengesRepository = new SupabaseChallengesRepository(supabase)
        const usersRepository = new SupabaseUsersRepository(supabase)
        const tool = new ListChallengesTool(challengesRepository, usersRepository)
        return await tool.handle(mcp)
      },
    })
  }

  static get publicTools() {
    return {
      getChallengeCreationInstructionsTool:
        ChallengingToolkit.getChallengeCreationInstructionsTool,
      getAllChallengeCategoriesTool: ChallengingToolkit.getAllChallengeCategoriesTool,
      listChallengesTool: ChallengingToolkit.listChallengesTool,
      postChallengeTool: ChallengingToolkit.postChallengingTool,
      updateChallengeTool: ChallengingToolkit.updateChallengeTool,
      deleteChallengeTool: ChallengingToolkit.deleteChallengeTool,
      getChallengeProblemTool: ChallengingToolkit.getChallengeProblemTool,
    }
  }
}
