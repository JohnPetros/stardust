import type { PlanetDto } from '#dtos'
import { AppError } from '@/@core/errors/global/AppError'
import { SpacePage } from '@/ui/space/widgets/pages/Space'
import { SpaceProvider } from '@/ui/space/contexts/SpaceContext'
import { ROUTES } from '@/ui/global/constants'
import { NextApiClient } from '@/infra/api/next/apiClient'

export default async function Space() {
  const apiClient = NextApiClient({ isCacheEnable: true })

  const response = await apiClient.get<PlanetDto[]>(ROUTES.server.planets)

  if (response.isError) throw new AppError(response.errorMessage)

  return (
    <SpaceProvider planetsDto={response.body}>
      <SpacePage />
    </SpaceProvider>
  )
}
