import type { Avatar } from '@stardust/core/shop/entities'
import type { AvatarDto } from '@stardust/core/shop/dtos'
import type { SupabaseAvatar } from '../types'

export const SupabaseAvatarMapper = () => {
  return {
    toDto(supabaseAvatar: SupabaseAvatar): AvatarDto {
      const avatarDto: AvatarDto = {
        id: supabaseAvatar.id,
        name: supabaseAvatar.name,
        image: supabaseAvatar.image,
        price: supabaseAvatar.price,
        isAcquiredByDefault: supabaseAvatar.is_acquired_by_default,
        isSelectedByDefault: supabaseAvatar.is_selected_by_default,
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
        is_acquired_by_default: avatarDto.isAcquiredByDefault ?? false,
        is_selected_by_default: avatarDto.isSelectedByDefault ?? false,
      }

      return supabaseAvatar
    },
  }
}
