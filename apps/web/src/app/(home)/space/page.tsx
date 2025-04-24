import type { PlanetDto } from '@stardust/core/space/dtos'

import { SpacePage } from '@/ui/space/widgets/pages/Space'
import { SpaceProvider } from '@/ui/space/contexts/SpaceContext'
import { NextApiClient } from '@/rest/next/NextApiClient'
import { ROUTES } from '@/constants'

export default async function Space() {
  const apiClient = NextApiClient({
    isCacheEnable: true,
  })
  const response = await apiClient.get<PlanetDto[]>(ROUTES.api.space.planets)
  if (response.isFailure) response.throwError()

  return (
    <SpaceProvider planetsDto={response.body}>
      <SpacePage />
    </SpaceProvider>
  )
}
