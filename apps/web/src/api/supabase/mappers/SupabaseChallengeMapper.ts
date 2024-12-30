import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto, TestCaseDto } from '@stardust/core/challenging/dtos'
import type { SupabaseChallenge } from '../types'
import type { TextBlockDto } from '@stardust/core/global/dtos'

export const SupabaseChallengeMapper = () => {
  return {
    toDto(supabaseChallenge: SupabaseChallenge): ChallengeDto {
      let textsBlocks: TextBlockDto[] = []
      if (supabaseChallenge.texts) {
        textsBlocks = (supabaseChallenge.texts as TextBlockDto[]).map((textBlock) => {
          return {
            type: textBlock.type,
            content: textBlock.content,
            isRunnable: textBlock.isRunnable,
            picture: textBlock.picture,
            title: textBlock.title,
          }
        })
      }

      const challengeDto: ChallengeDto = {
        id: supabaseChallenge.id ?? '',
        title: supabaseChallenge.title ?? '',
        code: supabaseChallenge.code ?? '',
        slug: supabaseChallenge.slug ?? '',
        difficulty: supabaseChallenge.difficulty ?? '',
        docId: supabaseChallenge.doc_id,
        functionName: supabaseChallenge.function_name,
        authorSlug: supabaseChallenge.user_slug ?? '',
        upvotesCount: supabaseChallenge.upvotes ?? 0,
        downvotesCount: supabaseChallenge.downvotes ?? 0,
        completionsCount: supabaseChallenge.total_completitions ?? 0,
        description: supabaseChallenge.description ?? '',
        textBlocks: textsBlocks,
        testCases: (supabaseChallenge.test_cases as TestCaseDto[]).map((testCase) => {
          return {
            position: testCase.position ?? '',
            inputs: testCase.inputs ?? [],
            expectedOutput: testCase.expectedOutput,
            isLocked: testCase.isLocked,
          }
        }),
        createdAt: supabaseChallenge.created_at
          ? new Date(supabaseChallenge.created_at)
          : new Date(),
      }

      return challengeDto
    },

    toSupabase(challenge: Challenge): SupabaseChallenge {
      const challengeDto = challenge.dto

      // @ts-ignore
      const supabaseChallenge: SupabaseChallenge = {
        id: challenge.id,
        title: challengeDto.title,
        code: challengeDto.code,
        slug: challengeDto.slug,
        difficulty: challengeDto.difficulty,
      }

      return supabaseChallenge
    },
  }
}
