import { and, eq } from 'drizzle-orm'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { challengeModel, challengeCodeExecutionModel } from '@/database/drizzle/schema'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { CodePlaybacksFaker } from '@stardust/core/global/structures/fakers'

export const OFFICIAL_SOLUTION_FIXTURE: CodePlaybackDto = {
  code: `funcao doisSoma(nums, alvo) {
  var vistos = {}
  para (var i = 0; i < nums.tamanho(); i++) {
    var complemento = alvo - nums[i]
    se (vistos[complemento] != nulo) retorna [vistos[complemento], i]
    vistos[nums[i]] = i
  }
}`,
  input: {
    content: 'nums = [2, 7, 11, 15]\nalvo = 9',
    overflow: 'scroll',
  },
  steps: [
    {
      activeLineRanges: [
        { startLine: 2, endLine: 2 },
        { startLine: 3, endLine: 4 },
      ],
      explanation: 'Inicia o mapa e calcula o complemento do primeiro item.',
      panels: [
        {
          type: 'sequence',
          title: 'NUMS',
          kind: 'array',
          items: [2, 7, 11, 15],
          showIndices: true,
          pointers: [
            { label: 'i', index: 0 },
            { label: 'j', index: 1 },
          ],
          highlights: [{ startIndex: 0, endIndex: 1, state: 'active' }],
          overflow: 'wrap',
        },
        {
          type: 'scalar',
          title: 'ALVO',
          value: 9,
          state: 'active',
        },
        {
          type: 'map',
          title: 'VISTOS',
          entries: [],
          emptyLabel: 'Vazio',
        },
        {
          type: 'set',
          title: 'VISITADOS',
          items: [],
          emptyLabel: 'Vazio',
        },
        {
          type: 'grid',
          title: 'COMPARAÇÕES',
          rows: [
            [
              { value: 2, state: 'active' },
              { value: 7, state: 'matched' },
            ],
            [{ value: 11 }, { value: 15 }],
          ],
          showIndices: true,
        },
        {
          type: 'result',
          title: 'RESULTADO',
          value: null,
          status: 'neutral',
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 5, endLine: 6 }],
      explanation: 'Registra o primeiro índice e encontra o complemento.',
      panels: [
        {
          type: 'sequence',
          title: 'NUMS',
          kind: 'array',
          items: [2, 7, 11, 15],
          showIndices: true,
          pointers: [{ label: 'i', index: 1 }],
          highlights: [
            { startIndex: 0, endIndex: 0, state: 'visited' },
            { startIndex: 1, endIndex: 1, state: 'matched' },
          ],
        },
        {
          type: 'map',
          title: 'VISTOS',
          entries: [{ key: '2', value: 0, state: 'visited' }],
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 5, endLine: 5 }],
      explanation: 'Retorna os índices que formam o alvo.',
      panels: [
        {
          type: 'result',
          title: 'RESULTADO',
          value: [0, 1],
          status: 'success',
          overflow: 'scroll',
        },
      ],
    },
  ],
}

export class ChallengingFixture {
  constructor(_supabase: SupabaseClient) {}

  async createCodeExecutions(
    executions: (typeof challengeCodeExecutionModel.$inferInsert)[],
  ) {
    if (executions.length)
      await DrizzleClient.getInstance()
        .insert(challengeCodeExecutionModel)
        .values(executions)
  }

  async findCodeExecutions(userId: string, challengeId: string) {
    return DrizzleClient.getInstance()
      .select()
      .from(challengeCodeExecutionModel)
      .where(
        and(
          eq(challengeCodeExecutionModel.userId, userId),
          eq(challengeCodeExecutionModel.challengeId, challengeId),
        ),
      )
  }

  async createChallenge(
    authorId: string,
    baseDto?: Partial<ChallengeDto>,
  ): Promise<ChallengeDto> {
    const challenge = ChallengesFaker.fakeDto({
      categories: [],
      starId: null,
      isPublic: true,
      isNew: false,
      ...baseDto,
    })
    const challengeSlug = challenge.slug
    if (challengeSlug === undefined) throw new Error('Challenge fixture requires a slug')
    challenge.author = { ...challenge.author, id: authorId }

    await DrizzleClient.getInstance()
      .insert(challengeModel)
      .values({
        id: challenge.id,
        title: challenge.title,
        difficultyLevel: challenge.difficultyLevel,
        initialCode: challenge.initialCode,
        description: challenge.description,
        slug: challengeSlug,
        userId: authorId,
        starId: challenge.starId,
        isPublic: challenge.isPublic ?? false,
        isNew: challenge.isNew ?? false,
        isEvaluatedByFunction: challenge.isEvaluatedByFunction ?? true,
        testCases: challenge.testCases,
        officialSolution: challenge.officialSolution ?? null,
      })

    return challenge
  }

  async createChallengeWithOfficialSolution(
    authorId: string,
    playback: CodePlaybackDto = CodePlaybacksFaker.fakeDto(),
    baseDto?: Partial<ChallengeDto>,
  ): Promise<ChallengeDto> {
    return this.createChallenge(authorId, {
      ...baseDto,
      officialSolution: playback,
    })
  }

  async setOfficialSolution(
    challengeId: string,
    officialSolution: CodePlaybackDto | null,
  ): Promise<void> {
    await DrizzleClient.getInstance()
      .update(challengeModel)
      .set({ officialSolution })
      .where(eq(challengeModel.id, challengeId))
  }
}
