import type { Rocket } from '@/@core/domain/entities'
import type { RocketDTO } from '@/@core/dtos'

import type { SupabaseRocket } from '../types'

export const SupabaseRocketMapper = () => {
  return {
    toDTO(supabaseRocket: SupabaseRocket): RocketDTO {
      const rocketDTO: RocketDTO = {
        id: supabaseRocket.id ?? '',
        name: supabaseRocket.name ?? '',
        price: supabaseRocket.price ?? 0,
        image: supabaseRocket.image ?? '',
        slug: supabaseRocket.slug ?? '',
      }

      return rocketDTO
    },

    toSupabase(rocket: Rocket): SupabaseRocket {
      const rocketDTO = rocket.dto

      const supabaseRocket: SupabaseRocket = {
        id: rocket.id,
        name: rocketDTO.name,
        slug: rocketDTO.slug,
        price: rocketDTO.price,
        image: rocketDTO.image,
      }

      return supabaseRocket
    },
  }
}
