import type { RocketDto } from '@stardust/core/shop/dtos'
import type { Rocket } from '@stardust/core/shop/entities'
import type { SupabaseRocket } from '../types'

export const SupabaseRocketMapper = () => {
  return {
    toDto(supabaseRocket: SupabaseRocket): RocketDto {
      const rocketDto: RocketDto = {
        id: supabaseRocket.id,
        name: supabaseRocket.name,
        price: supabaseRocket.price,
        image: supabaseRocket.image,
        isAcquiredByDefault: supabaseRocket.is_acquired_by_default,
        isSelectedByDefault: supabaseRocket.is_selected_by_default,
      }

      return rocketDto
    },

    toSupabase(rocket: Rocket): SupabaseRocket {
      const rocketDto = rocket.dto

      const supabaseRocket: SupabaseRocket = {
        id: rocket.id,
        name: rocketDto.name,
        slug: '',
        price: rocketDto.price,
        image: rocketDto.image,
        is_acquired_by_default: rocketDto.isAcquiredByDefault,
        is_selected_by_default: rocketDto.isSelectedByDefault,
      }

      return supabaseRocket
    },
  }
}
