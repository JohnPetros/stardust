import type { Planet } from '@/@core/domain/entities'

import type { PlanetDto } from '#dtos'
import type { SupabasePlanet } from '../types'
import { SupabaseStarMapper } from './SupabaseStarMapper'

export const SupabasePlanetMapper = () => {
  const supabaseStarMapper = SupabaseStarMapper()

  return {
    toDto(supabasePlanet: SupabasePlanet): PlanetDto {
      const planetDto: PlanetDto = {
        id: supabasePlanet.id ?? '',
        name: supabasePlanet.name ?? '',
        image: supabasePlanet.image ?? '',
        icon: supabasePlanet.icon ?? '',
        position: supabasePlanet.position ?? 1,
        stars: supabasePlanet.stars.map(supabaseStarMapper.toDto),
      }

      return planetDto
    },

    toSupabase(Planet: Planet): SupabasePlanet {
      const planetDto = Planet.dto

      const supabasePlanet: SupabasePlanet = {
        id: Planet.id,
        name: planetDto.name,
        icon: planetDto.icon,
        image: planetDto.image,
        position: planetDto.position,
        stars: [],
      }

      return supabasePlanet
    },
  }
}
