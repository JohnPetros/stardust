import { getLasUnlockedStarId } from './actions/getLasUnlockedStarId'
import { getPlanets } from './actions/getPlanets'
import { Space } from './components/Space'

import { SpaceProvider } from '@/contexts/SpaceContext'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { StarsController } from '@/services/api/supabase/controllers/starsController'
import { ERRORS } from '@/utils/constants'

export default async function HomePage() {
  const supabase = createServerClient()
  const starsController = StarsController(supabase)
  const authController = AuthController(supabase)

  const userId = await authController.getUserId()

  if (!userId) throw new Error(ERRORS.auth.userNotFound)

  const userUnlockedStarsIds =
    await starsController.getUserUnlockedStarsIds(userId)

  const planets = await getPlanets(userUnlockedStarsIds)
  const lastUnlockedStarId = await getLasUnlockedStarId(
    planets,
    userUnlockedStarsIds
  )

  return (
    <SpaceProvider>
      <Space planets={planets} lastUnlockedStarId={lastUnlockedStarId} />
    </SpaceProvider>
  )
}
