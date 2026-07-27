import type {
  ChallengeCategoryDto,
  ChallengeDto,
  TestCaseDto,
} from '@stardust/core/challenging/entities/dtos'
import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'
import { Challenge } from '@stardust/core/challenging/entities'
import { Datetime } from '@stardust/core/global/libs'

import type { Database, SupabaseChallenge } from '../../types'

type SupabaseChallengePayload = Database['public']['Tables']['challenges']['Insert']

/**
 * The paginated RPC intentionally omits the potentially large playback JSON.
 * Keep that projection explicit while allowing the same mapper to hydrate both
 * detail rows and list rows.
 */
export type SupabaseChallengeListRow = Omit<SupabaseChallenge, 'official_solution'> & {
  total_count: number
}

export type SupabaseChallengeRow = SupabaseChallenge | SupabaseChallengeListRow

export class SupabaseChallengeMapper {
  static toEntity(supabaseChallenge: SupabaseChallengeRow): Challenge {
    return Challenge.create(SupabaseChallengeMapper.toDto(supabaseChallenge))
  }

  static toDto(supabaseChallenge: SupabaseChallengeRow): ChallengeDto {
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
      isEvaluatedByFunction: Boolean(supabaseChallenge.is_evaluated_by_function ?? true),
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
      officialSolution:
        'official_solution' in supabaseChallenge &&
        supabaseChallenge.official_solution !== null
          ? (supabaseChallenge.official_solution as CodePlaybackDto)
          : null,
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
      is_evaluated_by_function: challenge.isEvaluatedByFunction.value,
      created_at: challenge.postedAt.toDateString(),
      star_id: '',
    }

    return supabaseChallenge
  }
}
