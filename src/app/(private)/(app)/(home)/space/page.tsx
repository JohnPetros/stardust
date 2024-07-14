import type { PlanetDTO } from '@/@core/dtos'
import { SpacePage } from '@/modules/app/components/pages/Space'
import { SpaceProvider } from '@/modules/app/contexts/SpaceContext'
import { ROUTES } from '@/modules/global/constants'
import { NextClient } from '@/server/client'

export default async function Space() {
  const client = NextClient({ isCacheEnable: true })

  const planetsDTO = await client.get<PlanetDTO[]>(ROUTES.server.planets)

  return (
    <SpaceProvider planetsDTO={planetsDTO}>
      <SpacePage />
    </SpaceProvider>
  )
}
