import { createClient as createServerClient } from 'supabase/supabase-server'

import { Space } from './components/Space'

import { SpaceProvider } from '@/contexts/SpaceContext'
import { PlanetService } from '@/services/api/planetService'

export default async function Home() {
  const supabase = createServerClient()
  const planetService = PlanetService(supabase)
  const planets = await planetService.getPlanets()

  return (
    <SpaceProvider>
      <Space planets={planets} />
    </SpaceProvider>
  )
}
