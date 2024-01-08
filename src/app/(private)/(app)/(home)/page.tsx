import { Space } from './components/Space'

import { SpaceProvider } from '@/contexts/SpaceContext'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { PlanetsController } from '@/services/api/supabase/controllers/planetsController'

export default async function HomePage() {
  const supabase = createServerClient()
  const planetsController = PlanetsController(supabase)
  const planets = await planetsController.getPlanets()

  return (
    <SpaceProvider>
      <Space planets={planets} />
    </SpaceProvider>
  )
}
