import { Solution } from '@stardust/core/challenging/entities'
import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'

import type { SupabaseSolution } from '../../types'

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

  static toSupabase(solution: Solution): SupabaseSolution {
    const supabaseSolution: SupabaseSolution = {
      id: solution.id.value,
      title: solution.title.value,
      content: solution.content.value,
      views_count: solution.viewsCount.value,
      author_id: solution.author.id.value,
      comments_count: solution.commentsCount.value,
      slug: solution.slug.value,
      challenge_id: solution.challengeId.value,
      author_avatar_image: solution.author.avatar.image.value,
      author_avatar_name: solution.author.avatar.name.value,
      author_name: solution.author.name.value,
      author_slug: solution.author.slug.value,
      upvotes_count: solution.upvotesCount.value,
      created_at: solution.postedAt.toISOString(),
    }
    return supabaseSolution
  }
}
