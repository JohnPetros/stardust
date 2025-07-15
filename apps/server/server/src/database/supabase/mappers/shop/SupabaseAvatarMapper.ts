import type { AvatarDto } from '@stardust/core/shop/entities/dtos'
import { Avatar } from '@stardust/core/shop/entities'

import type { SupabaseAvatar } from '../../types'

export class SupabaseAvatarMapper {
  static toEntity(supabaseAvatar: SupabaseAvatar): Avatar {
    return Avatar.create(SupabaseAvatarMapper.toDto(supabaseAvatar))
  }

  static toDto(supabaseAvatar: SupabaseAvatar): AvatarDto {
    const avatarDto: AvatarDto = {
      id: supabaseAvatar.id,
      name: supabaseAvatar.name,
      image: supabaseAvatar.image,
      price: supabaseAvatar.price,
      isAcquiredByDefault: supabaseAvatar.is_acquired_by_default,
      isSelectedByDefault: supabaseAvatar.is_selected_by_default,
    }

    return avatarDto
  }

  static toSupabase(avatar: Avatar): SupabaseAvatar {
    const avatarDto = avatar.dto

    const supabaseAvatar: SupabaseAvatar = {
      id: avatar.id.value,
      name: avatarDto.name,
      image: avatarDto.image,
      price: avatarDto.price,
      is_acquired_by_default: avatarDto.isAcquiredByDefault ?? false,
      is_selected_by_default: avatarDto.isSelectedByDefault ?? false,
    }

    return supabaseAvatar
  }
}
