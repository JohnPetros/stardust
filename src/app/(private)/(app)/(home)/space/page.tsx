import type { PlanetDTO } from '@/@core/dtos'
import { AppError } from '@/@core/errors/global/AppError'
import { SpacePage } from '@/modules/app/components/pages/Space'
import { SpaceProvider } from '@/modules/app/contexts/SpaceContext'
import { ROUTES } from '@/modules/global/constants'
import { NextClient } from '@/server/client'

export default async function Space() {
  const client = NextClient({ isCacheEnable: true })

  const response = await client.get<PlanetDTO[]>(ROUTES.server.planets)

  if (response.isError) throw new AppError(response.errorMessage)

  return (
    <SpaceProvider planetsDTO={response.body}>
      <SpacePage />
    </SpaceProvider>
  )
}
