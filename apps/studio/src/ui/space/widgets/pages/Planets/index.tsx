import { useLoaderData } from 'react-router'
import { PlanetsPageView } from './PlanetsPageView'
import type { clientLoader } from '@/app/routes/PlanetsRoute'
import { Planet } from '@stardust/core/space/entities'

export const PlanetsPage = () => {
  const { planets } = useLoaderData<typeof clientLoader>()

  return <PlanetsPageView planets={planets.map(Planet.create)} />
}
