import type { RocketDto } from '@stardust/core/shop/entities/dtos'
import { Rocket } from '@stardust/core/shop/entities'

import type { Database, SupabaseRocket } from '../../types'

type SupabaseRocketPayload = Database['public']['Tables']['rockets']['Insert']

export class SupabaseRocketMapper {
  static toEntity(supabaseRocket: SupabaseRocket): Rocket {
    return Rocket.create(SupabaseRocketMapper.toDto(supabaseRocket))
  }

  static toDto(supabaseRocket: SupabaseRocket): RocketDto {
    const rocketDto: RocketDto = {
      id: supabaseRocket.id,
      name: supabaseRocket.name,
      price: supabaseRocket.price,
      image: supabaseRocket.image,
      isPurchasable: supabaseRocket.is_purchasable,
      isAcquiredByDefault: supabaseRocket.is_acquired_by_default,
      isSelectedByDefault: supabaseRocket.is_selected_by_default,
    }

    return rocketDto
  }

  static toSupabase(rocket: Rocket): SupabaseRocketPayload {
    const rocketDto = rocket.dto

    const supabaseRocket: SupabaseRocketPayload = {
      id: rocket.id.value,
      name: rocketDto.name,
      price: rocketDto.price,
      image: rocketDto.image,
      is_purchasable: rocketDto.isPurchasable ?? true,
    }

    return supabaseRocket
  }
}
