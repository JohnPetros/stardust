import { Planet } from '@stardust/core/space/entities'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'

import { SupabaseStarMapper } from './SupabaseStarMapper'
import type { SupabasePlanet } from '../../types'

export class SupabasePlanetMapper {
  static toEntity(supabasePlanet: SupabasePlanet): Planet {
    return Planet.create(SupabasePlanetMapper.toDto(supabasePlanet))
  }

  static toDto(supabasePlanet: SupabasePlanet): PlanetDto {
    const planetDto: PlanetDto = {
      id: supabasePlanet.id ?? '',
      name: supabasePlanet.name ?? '',
      image: supabasePlanet.image ?? '',
      icon: supabasePlanet.icon ?? '',
      position: supabasePlanet.position ?? 1,
      completionsCount: supabasePlanet.completions_count ?? 0,
      stars: supabasePlanet.stars.map(SupabaseStarMapper.toDto),
      isAvailable: supabasePlanet.is_available ?? false,
    }

    return planetDto
  }

  static toSupabase(planet: Planet): SupabasePlanet {
    const planetDto = planet.dto

    const supabasePlanet: SupabasePlanet = {
      id: planet.id.value,
      name: planetDto.name,
      icon: planetDto.icon,
      image: planetDto.image,
      position: planetDto.position,
      completions_count: 0,
      stars: [],
      is_available: planetDto.isAvailable,
    }

    return supabasePlanet
  }
}
