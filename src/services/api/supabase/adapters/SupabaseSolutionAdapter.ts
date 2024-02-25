
import type { Solution } from '@/@types/Solution'

import type { SupabaseSolution } from '../types/SupabaseSolution'

export const SupabaseSolutionAdapter = (supabaseSolution: SupabaseSolution) => {
  const solution: Solution = {
    id: supabaseSolution.id,
    title: supabaseSolution.title,
    content: supabaseSolution.content,
    challengeId: supabaseSolution.challenge_id,
    createdAt: new Date(supabaseSolution.created_at),
    user: {
      slug: supabaseSolution.user.slug,
      avatarId: supabaseSolution.user.avatar_id,
    },
    commentsCount: supabaseSolution.replies[0].count,
    upvotesCount: supabaseSolution.upvotes[0].count,
  }

  return solution
}
