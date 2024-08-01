import type { PlanetDTO } from '@/@core/dtos'
import { AppError } from '@/@core/errors/global/AppError'
import { SpacePage } from '@/modules/app/components/pages/Space'
import { SpaceProvider } from '@/modules/app/contexts/SpaceContext'
import { ROUTES } from '@/modules/global/constants'
import { NextApiClient } from '@/server/NextApiClient'

export default async function Space() {
  const apiClient = NextApiClient({ isCacheEnable: true })

  const response = await apiClient.get<PlanetDTO[]>(ROUTES.server.planets)

  if (response.isError) throw new AppError(response.errorMessage)

  return (
    <SpaceProvider planetsDTO={response.body}>
      <SpacePage />
    </SpaceProvider>
  )
}
