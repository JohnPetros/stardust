import type { SupabaseAvatar } from '../types/SupabaseAvatar'

import type { Avatar } from '@/@types/Avatar'

export const SupabaseAvatarAdapter = (supabaseAvatar: SupabaseAvatar) => {
  const avatar: Avatar = {
    id: supabaseAvatar.id,
    image: supabaseAvatar.image,
    name: supabaseAvatar.name,
    price: supabaseAvatar.price,
  }

  return avatar
}
