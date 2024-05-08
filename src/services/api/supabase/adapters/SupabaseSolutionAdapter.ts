
import type { Solution } from '@/@types/Solution'

import type { SupabaseSolution } from '../types/SupabaseSolution'

export const SupabaseSolutionAdapter = (supabaseSolution: SupabaseSolution) => {
  const solution: Solution = {
    id: supabaseSolution.id,
    title: supabaseSolution.title,
    content: supabaseSolution.content,
    slug: supabaseSolution.slug,
    challengeId: supabaseSolution.challenge_id,
    user: {
      slug: supabaseSolution.user.slug,
      avatarId: supabaseSolution.user.avatar_id,
    },
    upvotesCount: supabaseSolution.upvotes[0].count,
    commentsCount: supabaseSolution.comments ? supabaseSolution.comments[0].count : 0,
    createdAt: new Date(supabaseSolution.created_at),
  }

  return solution
}
