import type {
  ChallengeCategoryDto,
  ChallengeDto,
  TestCaseDto,
} from '@stardust/core/challenging/entities/dtos'
import { Challenge } from '@stardust/core/challenging/entities'
import { Datetime } from '@stardust/core/global/libs'

import type { Database, SupabaseChallenge } from '../../types'

type SupabaseChallengePayload = Database['public']['Tables']['challenges']['Insert']

export class SupabaseChallengeMapper {
  static toEntity(supabaseChallenge: SupabaseChallenge): Challenge {
    return Challenge.create(SupabaseChallengeMapper.toDto(supabaseChallenge))
  }

  static toDto(supabaseChallenge: SupabaseChallenge): ChallengeDto {
    const challengeDto: ChallengeDto = {
      id: supabaseChallenge.id ?? '',
      title: supabaseChallenge.title ?? '',
      initialCode: supabaseChallenge.initial_code ?? '',
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
      completionCount: supabaseChallenge.total_completitions ?? 0,
      description: supabaseChallenge.description ?? '',
      isPublic: Boolean(supabaseChallenge.is_public),
      isNew: Boolean(supabaseChallenge.is_new ?? false),
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
  }

  static toSupabase(challenge: Challenge): SupabaseChallengePayload {
    const challengeDto = challenge.dto

    const supabaseChallenge: SupabaseChallengePayload = {
      id: challenge.id.value,
      slug: challenge.slug.value,
      title: challengeDto.title,
      initial_code: challengeDto.initialCode,
      difficulty_level: challengeDto.difficultyLevel,
      test_cases: JSON.stringify(challengeDto.testCases),
      description: challengeDto.description,
      user_id: challengeDto.author.id,
      is_public: challenge.isPublic.value,
      is_new: challenge.isNew.value,
      created_at: challenge.postedAt.toDateString(),
      star_id: '',
    }

    return supabaseChallenge
  }
}
