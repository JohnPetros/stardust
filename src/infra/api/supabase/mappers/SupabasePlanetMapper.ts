import type { Planet } from '@/@core/domain/entities'

import type { PlanetDTO } from '@/@core/dtos'
import type { SupabasePlanet } from '../types'
import { SupabaseStarMapper } from './SupabaseStarMapper'

export const SupabasePlanetMapper = () => {
  const supabaseStarMapper = SupabaseStarMapper()

  return {
    toDTO(supabasePlanet: SupabasePlanet): PlanetDTO {
      const planetDTO: PlanetDTO = {
        id: supabasePlanet.id ?? '',
        name: supabasePlanet.name ?? '',
        image: supabasePlanet.image ?? '',
        icon: supabasePlanet.icon ?? '',
        position: supabasePlanet.position ?? 1,
        stars: supabasePlanet.stars.map(supabaseStarMapper.toDTO),
      }

      return planetDTO
    },

    toSupabase(Planet: Planet): SupabasePlanet {
      const planetDTO = Planet.dto

      const supabasePlanet: SupabasePlanet = {
        id: Planet.id,
        name: planetDTO.name,
        icon: planetDTO.icon,
        image: planetDTO.image,
        position: planetDTO.position,
        stars: [],
      }

      return supabasePlanet
    },
  }
}
