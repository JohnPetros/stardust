import { Solution } from '@stardust/core/challenging/entities'
import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'

import type { SupabaseSolution, SupabaseSolutionPayload } from '../../types'

export class SupabaseSolutionMapper {
  static toEntity(supabaseSolution: SupabaseSolution): Solution {
    return Solution.create(SupabaseSolutionMapper.toDto(supabaseSolution))
  }

  static toDto(supabaseSolution: SupabaseSolution): SolutionDto {
    const solutionDto: SolutionDto = {
      id: supabaseSolution.id ?? '',
      title: supabaseSolution.title ?? '',
      content: supabaseSolution.content ?? '',
      slug: supabaseSolution.slug ?? '',
      challengeId: supabaseSolution.challenge_id ?? '',
      upvotesCount: supabaseSolution.upvotes_count ?? 0,
      viewsCount: supabaseSolution.views_count ?? 0,
      commentsCount: supabaseSolution.comments_count ?? 0,
      author: {
        id: supabaseSolution.author_id ?? '',
        entity: {
          slug: supabaseSolution.author_slug ?? '',
          name: supabaseSolution.author_name ?? '',
          avatar: {
            name: supabaseSolution.author_avatar_name ?? '',
            image: supabaseSolution.author_avatar_image ?? '',
          },
        },
      },
      postedAt: new Date(supabaseSolution.created_at ?? ''),
    }
    return solutionDto
  }

  static toSupabase(solution: Solution): SupabaseSolutionPayload {
    const supabaseSolution: SupabaseSolutionPayload = {
      id: solution.id.value,
      title: solution.title.value,
      content: solution.content.value,
      views_count: solution.viewsCount.value,
      user_id: solution.author.id.value,
      slug: solution.slug.value,
      challenge_id: solution.challengeId.value,
      created_at: solution.postedAt.toISOString(),
    }
    return supabaseSolution
  }
}
