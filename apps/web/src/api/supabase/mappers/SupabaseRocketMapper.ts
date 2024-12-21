import type { RocketDto } from '@stardust/core/shop/dtos'
import type { Rocket } from '@stardust/core/shop/entities'
import type { SupabaseRocket } from '../types'

export const SupabaseRocketMapper = () => {
  return {
    toDto(supabaseRocket: SupabaseRocket): RocketDto {
      const rocketDto: RocketDto = {
        id: supabaseRocket.id ?? '',
        name: supabaseRocket.name ?? '',
        price: supabaseRocket.price ?? 0,
        image: supabaseRocket.image ?? '',
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
      }

      return supabaseRocket
    },
  }
}
