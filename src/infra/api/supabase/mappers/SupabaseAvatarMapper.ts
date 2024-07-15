import type { AvatarDTO } from '@/@core/dtos'
import type { SupabaseAvatar } from '../types'
import type { Avatar } from '@/@core/domain/entities'

export const SupabaseAvatarMapper = () => {
  return {
    toDTO(supabaseAvatar: SupabaseAvatar): AvatarDTO {
      const avatarDTO: AvatarDTO = {
        id: supabaseAvatar.id,
        name: supabaseAvatar.name,
        image: supabaseAvatar.image,
        price: supabaseAvatar.price,
      }

      return avatarDTO
    },

    toSupabase(avatar: Avatar): SupabaseAvatar {
      const avatarDTO = avatar.dto

      const supabaseAvatar: SupabaseAvatar = {
        id: avatar.id,
        name: avatarDTO.name,
        image: avatarDTO.image,
        price: avatarDTO.price,
      }

      return supabaseAvatar
    },
  }
}
