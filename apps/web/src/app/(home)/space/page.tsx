import type { PlanetDto } from '@stardust/core/space/entities/dtos'

import { SpacePage } from '@/ui/space/widgets/pages/Space'
import { SpaceProvider } from '@/ui/space/contexts/SpaceContext'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { ROUTES } from '@/constants'

export default async function Space() {
  const apiClient = NextRestClient({
    isCacheEnabled: true,
  })
  const response = await apiClient.get<PlanetDto[]>(ROUTES.api.space.planets)
  if (response.isFailure) response.throwError()

  return (
    <SpaceProvider planetsDto={response.body}>
      <SpacePage />
    </SpaceProvider>
  )
}
