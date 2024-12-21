import type { AvatarDto } from '#dtos'
import type { SupabaseAvatar } from '../types'
import type { Avatar } from '@/@core/domain/entities'

export const SupabaseAvatarMapper = () => {
  return {
    toDto(supabaseAvatar: SupabaseAvatar): AvatarDto {
      const avatarDto: AvatarDto = {
        id: supabaseAvatar.id,
        name: supabaseAvatar.name,
        image: supabaseAvatar.image,
        price: supabaseAvatar.price,
      }

      return avatarDto
    },

    toSupabase(avatar: Avatar): SupabaseAvatar {
      const avatarDto = avatar.dto

      const supabaseAvatar: SupabaseAvatar = {
        id: avatar.id,
        name: avatarDto.name,
        image: avatarDto.image,
        price: avatarDto.price,
      }

      return supabaseAvatar
    },
  }
}
