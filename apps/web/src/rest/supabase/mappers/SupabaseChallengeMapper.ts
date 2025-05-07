import type { Challenge } from '@stardust/core/challenging/entities'
import type {
  ChallengeCategoryDto,
  ChallengeDto,
  TestCaseDto,
} from '@stardust/core/challenging/entities/dtos'
import type { SupabaseChallenge } from '../types'
import { Datetime } from '@stardust/core/global/libs'

export const SupabaseChallengeMapper = () => {
  return {
    toDto(supabaseChallenge: SupabaseChallenge): ChallengeDto {
      const challengeDto: ChallengeDto = {
        id: supabaseChallenge.id ?? '',
        title: supabaseChallenge.title ?? '',
        code: supabaseChallenge.code ?? '',
        slug: supabaseChallenge.slug ?? '',
        difficultyLevel: supabaseChallenge.difficulty_level ?? '',
        author: {
          id: supabaseChallenge.user_id ?? '',
          entity: {
            slug: supabaseChallenge.author_slug ?? '',
            name: supabaseChallenge.author_name ?? '',
            avatar: {
              name: supabaseChallenge.author_avatar_name ?? '',
              image: supabaseChallenge.author_avatar_image ?? '',
            },
          },
        },
        upvotesCount: supabaseChallenge.upvotes_count ?? 0,
        downvotesCount: supabaseChallenge.downvotes_count ?? 0,
        completionsCount: supabaseChallenge.total_completitions ?? 0,
        description: supabaseChallenge.description ?? '',
        isPublic: Boolean(supabaseChallenge.is_public),
        testCases: (
          (typeof supabaseChallenge.test_cases === 'string'
            ? JSON.parse(supabaseChallenge.test_cases)
            : supabaseChallenge.test_cases) as TestCaseDto[]
        ).map((supabaseTestCase) => {
          return {
            position: supabaseTestCase.position ?? '',
            inputs: supabaseTestCase.inputs ?? [],
            expectedOutput: supabaseTestCase.expectedOutput,
            isLocked: supabaseTestCase.isLocked,
          }
        }),
        categories: (supabaseChallenge.categories as ChallengeCategoryDto[]).map(
          (supabaseCategory) => {
            return {
              id: supabaseCategory.id,
              name: supabaseCategory.name,
            }
          },
        ),
        starId: supabaseChallenge.star_id,
        postedAt: new Datetime(supabaseChallenge.created_at).date(),
      }

      return challengeDto
    },

    toSupabase(challenge: Challenge): SupabaseChallenge {
      const challengeDto = challenge.dto

      // @ts-ignore
      const supabaseChallenge: SupabaseChallenge = {
        id: challenge.id.value,
        slug: challenge.slug.value,
        title: challengeDto.title,
        code: challengeDto.code,
        difficulty_level: challengeDto.difficultyLevel,
        test_cases: JSON.stringify(challengeDto.testCases),
        description: challengeDto.description,
        user_id: challengeDto.author.id,
        is_public: challenge.isPublic.value,
        created_at: challenge.postedAt.toDateString(),
        categories: [],
        star_id: '',
      }

      return supabaseChallenge
    },
  }
}
