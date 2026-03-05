import type { RocketDto } from '@stardust/core/shop/entities/dtos'
import { Rocket } from '@stardust/core/shop/entities'

import type { SupabaseRocket } from '../../types'

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

  static toSupabase(
    rocket: Rocket,
  ): Omit<SupabaseRocket, 'is_acquired_by_default' | 'is_selected_by_default'> {
    const rocketDto = rocket.dto

    const supabaseRocket: Omit<
      SupabaseRocket,
      'is_acquired_by_default' | 'is_selected_by_default'
    > = {
      id: rocket.id.value,
      name: rocketDto.name,
      price: rocketDto.price,
      image: rocketDto.image,
      is_purchasable: rocketDto.isPurchasable ?? true,
    }

    return supabaseRocket
  }
}
