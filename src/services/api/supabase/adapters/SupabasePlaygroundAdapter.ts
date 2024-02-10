import type { SupabasePlayground } from '../types/SupabasePlayground'

import type { Playground } from '@/@types/Playground'

export const SupabasePlaygroundAdapter = (
  supabasePlayground: SupabasePlayground
) => {
  const playground: Playground = {
    id: supabasePlayground.id,
    title: supabasePlayground.title,
    code: supabasePlayground.code,
    isPublic: supabasePlayground.is_public,
    user: {
      id: supabasePlayground.user.id,
      slug: supabasePlayground.user.slug,
      avatarId: supabasePlayground.user.avatar_id,
    },
  }

  return playground
}
