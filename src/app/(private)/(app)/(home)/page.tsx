import { _handleSpacePage } from './actions/_handleSpacePage'
import { Space } from './components/Space'

import { SpaceProvider } from '@/contexts/SpaceContext'
import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthController } from '@/services/api/supabase/controllers/SupabaseAuthController'
import { SupabasePlanetsController } from '@/services/api/supabase/controllers/SupabasePlanetsController'
import { SupabaseStarsController } from '@/services/api/supabase/controllers/SupabaseStarsController'

export default async function SpacePage() {
  const supabase = SupabaseServerClient()
  const authController = SupabaseAuthController(supabase)
  const starsController = SupabaseStarsController(supabase)
  const planetsController = SupabasePlanetsController(supabase)

  const { planets, lastUnlockedStarId } = await _handleSpacePage({
    authController,
    starsController,
    planetsController,
  })

  return (
    <SpaceProvider>
      <Space planets={planets} lastUnlockedStarId={lastUnlockedStarId} />
    </SpaceProvider>
  )
}
