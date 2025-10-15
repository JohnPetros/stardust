import type { Route } from '../+types/root'

import { StorageFolder } from '@stardust/core/storage/structures'

import { PlanetsPage } from '@/ui/space/widgets/pages/Planets'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { restContext } from '../contexts/RestContext'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context }: Route.LoaderArgs) => {
  const { spaceService } = context.get(restContext)
  const response = await spaceService.fetchPlanets()

  return {
    planets: response.body.map((planet) => ({
      ...planet,
      image: useStorageImage(StorageFolder.createAsPlanets(), planet.image),
      icon: useStorageImage(StorageFolder.createAsPlanets(), planet.icon),
    })),
  }
}

const PlanetsRoute = () => {
  return <PlanetsPage />
}

export default PlanetsRoute
