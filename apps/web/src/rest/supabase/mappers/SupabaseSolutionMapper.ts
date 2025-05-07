import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'
import type { Solution } from '@stardust/core/challenging/entities'
import type { SupabaseSolution } from '../types'

export const SupabaseSolutionMapper = () => {
  return {
    toDto(supabaseSolution: SupabaseSolution): SolutionDto {
      const solutionDto: SolutionDto = {
        id: supabaseSolution.id ?? '',
        title: supabaseSolution.title ?? '',
        content: supabaseSolution.content ?? '',
        slug: supabaseSolution.slug ?? '',
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
    },

    toSupabase(solution: Solution): SupabaseSolution {
      const supabaseSolution: SupabaseSolution = {
        id: solution.id.value,
        title: solution.title.value,
        content: solution.content.value,
        views_count: solution.viewsCount.value,
        author_id: solution.author.id.value,
        comments_count: solution.commentsCount.value,
        slug: solution.slug.value,
      } as SupabaseSolution

      return supabaseSolution
    },
  }
}
