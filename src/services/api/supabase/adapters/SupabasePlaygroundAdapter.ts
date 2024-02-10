import type { SupabasePlayground } from '../types/SupabasePlayground'

import type { Playground } from '@/@types/Playground'

export const SupabasePlaygroundAdapter = (
  supabasePlayground: SupabasePlayground
) => {
  const userPlayground = supabasePlayground.user
    ? {
        slug: supabasePlayground.user.slug,
        avatarId: supabasePlayground.user.avatar_id,
      }
    : null

  let playground: Playground = {
    id: supabasePlayground.id,
    title: supabasePlayground.title,
    code: supabasePlayground.code,
    isPublic: supabasePlayground.is_public,
  }

  if (userPlayground) {
    playground = { ...playground, user: userPlayground }
  }

  return playground
}
