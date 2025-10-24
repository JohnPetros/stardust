import { useLoaderData } from 'react-router'
import { PlanetsPageView } from './PlanetsPageView'
import type { clientLoader } from '@/app/routes/PlanetsRoute'
import { Planet } from '@stardust/core/space/entities'
import { usePlanetsPage } from './usePlanetsPage'
import { useRest } from '@/ui/global/hooks/useRest'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useUiProvider } from '@/ui/global/hooks/useUiProvider'

export const PlanetsPage = () => {
  const { planets } = useLoaderData<typeof clientLoader>()
  const { spaceService } = useRest()
  const toastProvider = useToastProvider()
  const uiProvider = useUiProvider()
  const { handlePlanetCreate } = usePlanetsPage({
    service: spaceService,
    toastProvider,
    uiProvider,
  })

  return (
    <PlanetsPageView
      planets={planets.map(Planet.create)}
      onPlanetFormSubmit={handlePlanetCreate}
    />
  )
}
