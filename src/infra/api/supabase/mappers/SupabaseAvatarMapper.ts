import type { AvatarDTO } from '@/@core/dtos'
import type { SupabaseAvatar } from '../types'
import { Avatar } from '@/@core/domain/entities'

export const SupabaseAvatarMapper = () => {
  return {
    toAvatar(supabaseAvatar: SupabaseAvatar): Avatar {
      const AvatarDTO: AvatarDTO = {
        id: supabaseAvatar.id,
        name: supabaseAvatar.name,
        image: supabaseAvatar.image,
        price: supabaseAvatar.price,
      }

      return Avatar.create(AvatarDTO)
    },

    toSupabase(avatar: Avatar): SupabaseAvatar {
      const avatarDTO = avatar.dto

      const supabaseAvatar: SupabaseAvatar = {
        id: avatarDTO.id,
        name: avatarDTO.name,
        image: avatarDTO.image,
        price: avatarDTO.price,
      }

      return supabaseAvatar
    },
  }
}
