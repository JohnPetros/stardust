import type { PlanetDto } from '@stardust/core/space/dtos'
import type { Planet } from '@stardust/core/space/entities'
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

    toSupabase(planet: Planet): SupabasePlanet {
      const planetDto = planet.dto

      const supabasePlanet: SupabasePlanet = {
        id: planet.id,
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
