import type { SupabaseComment } from '../types/SupabaseComment'

import type { Comment } from '@/@types/Comment'

export const SupabaseCommentAdapter = (supabaseComment: SupabaseComment) => {
  const comment: Comment = {
    id: supabaseComment.id,
    content: supabaseComment.content,
    challengeId: supabaseComment.challenge_id,
    parentCommentId: supabaseComment.parent_comment_id,
    createdAt: new Date(supabaseComment.created_at),
    user: {
      slug: supabaseComment.user.slug,
      avatarId: supabaseComment.user.avatar_id,
    },
    repliesCount: supabaseComment.replies[0].count,
    upvotesCount: supabaseComment.upvotes[0].count,
  }

  return comment
}
