import type { Challenge } from '@stardust/core/challenging/entities'
import type {
  ChallengeCategoryDto,
  ChallengeDto,
  TestCaseDto,
} from '@stardust/core/challenging/dtos'
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
        difficultyLevel: supabaseChallenge.difficulty ?? '',
        docId: supabaseChallenge.doc_id,
        function: {
          name: supabaseChallenge.function_name ?? '',
          params: [],
        },
        author: {
          id: supabaseChallenge.user_id ?? '',
        },
        upvotesCount: supabaseChallenge.upvotes ?? 0,
        downvotesCount: supabaseChallenge.downvotes ?? 0,
        completionsCount: supabaseChallenge.total_completitions ?? 0,
        description: supabaseChallenge.description ?? '',
        textBlocks: textsBlocks,
        testCases: (supabaseChallenge.test_cases as TestCaseDto[]).map(
          (supabaseTestCase) => {
            return {
              position: supabaseTestCase.position ?? '',
              inputs: supabaseTestCase.inputs ?? [],
              expectedOutput: supabaseTestCase.expectedOutput,
              isLocked: supabaseTestCase.isLocked,
            }
          },
        ),
        categories: (supabaseChallenge.categories as ChallengeCategoryDto[]).map(
          (supabaseCategory) => {
            return {
              id: supabaseCategory.id,
              name: supabaseCategory.name,
            }
          },
        ),
        starId: supabaseChallenge.star_id,
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
        slug: challenge.slug.value,
        title: challengeDto.title,
        code: challengeDto.code,
        difficulty: challengeDto.difficultyLevel,
        test_cases: JSON.stringify(challengeDto.testCases),
        description: challengeDto.description,
        user_id: challengeDto.author.id,
        function_name: challengeDto.function?.name ?? null,
        texts: [],
        star_id: '',
        doc_id: '',
        categories: [],
      }

      return supabaseChallenge
    },
  }
}
