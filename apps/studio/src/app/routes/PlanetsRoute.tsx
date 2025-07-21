import { spaceService } from '@/rest'
import { PlanetsPage } from '@/ui/space/widgets/pages/Planets'

export const clientLoader = async () => {
  const response = await spaceService.fetchPlanets()

  return {
    planets: response.body,
  }
}

const PlanetsRoute = () => {
  return <PlanetsPage />
}

export default PlanetsRoute
