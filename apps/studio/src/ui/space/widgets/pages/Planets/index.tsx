import { useLoaderData } from 'react-router'
import { PlanetsPageView } from './PlanetsPageView'
import type { clientLoader } from '@/app/routes/PlanetsRoute'
import { usePlanetsPage } from './usePlanetsPage'
import { useRest } from '@/ui/global/hooks/useRest'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useUiProvider } from '@/ui/global/hooks/useUiProvider'

export const PlanetsPage = () => {
  const { planetsDto } = useLoaderData<typeof clientLoader>()
  const { spaceService } = useRest()
  const toastProvider = useToastProvider()
  const uiProvider = useUiProvider()
  const { planets, handlePlanetCreate, handleDragEnd } = usePlanetsPage({
    planetsDto,
    service: spaceService,
    toastProvider,
    uiProvider,
  })

  return (
    <PlanetsPageView
      planets={planets}
      onPlanetFormSubmit={handlePlanetCreate}
      onDragEnd={handleDragEnd}
    />
  )
}
