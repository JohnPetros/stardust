import type { SupabasePlanet } from '../types/SupabasePlanet'

import type { Planet } from '@/@types/Planet'

export const SupabasePlanetAdapter = (supabasePlanet: SupabasePlanet) => {
  const planet: Planet = {
    id: supabasePlanet.id,
    name: supabasePlanet.name,
    icon: supabasePlanet.icon,
    image: supabasePlanet.image,
    position: supabasePlanet.position,
    stars: supabasePlanet.stars.map((star) => ({
      id: star.id,
      name: star.name,
      number: star.number,
      slug: star.slug,
      isChallenge: star.is_challenge,
    })),
  }

  return planet
}
