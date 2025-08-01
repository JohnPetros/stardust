import type { Route } from '../+types/root'

import { StorageFolder } from '@stardust/core/storage/structures'

import { useImage } from '@/ui/global/hooks/useImage'
import { PlanetsPage } from '@/ui/space/widgets/pages/Planets'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { restContext } from '../contexts/restContext'

export const unstable_clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.ActionArgs) => {
  const { spaceService } = context.get(restContext)
  const response = await spaceService.fetchPlanets()

  return {
    planets: response.body.map((planet) => ({
      ...planet,
      image: useImage(StorageFolder.createAsPlanets(), planet.image),
      icon: useImage(StorageFolder.createAsPlanets(), planet.icon),
    })),
  }
}

const PlanetsRoute = () => {
  return <PlanetsPage />
}

export default PlanetsRoute
