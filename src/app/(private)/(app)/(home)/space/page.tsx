import type { PlanetDTO } from '@/@core/dtos'
import { AppError } from '@/@core/errors/global/AppError'
import { SpacePage } from '@/ui/app/components/pages/Space'
import { SpaceProvider } from '@/ui/app/contexts/SpaceContext'
import { ROUTES } from '@/ui/global/constants'
import { NextApiClient } from '@/infra/api/next/apiClient'

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
