import { _handleUserPlaygroudsPage } from './actions/_handleUserPlaygroundPage'
import { AddPlaygroundButton } from './components/AddPlaygroundButton'
import { PlaygroundCards } from './components/PlaygroundCards'
import { PlaygroundPageHero } from './components/PlaygroundPageHero'

import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthController } from '@/services/api/supabase/controllers/SupabaseAuthController'
import { SupabasePlaygroundsController } from '@/services/api/supabase/controllers/SupabasePlaygroundsController'
import { SupabaseUsersController } from '@/services/api/supabase/controllers/SupabaseUsersController'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function UserPlaygroundsPage() {
  const supabase = SupabaseServerClient()
  const authController = SupabaseAuthController(supabase)
  const usersController = SupabaseUsersController(supabase)
  const playgroundsController = SupabasePlaygroundsController(supabase)

  const playgrounds = await _handleUserPlaygroudsPage(
    authController,
    usersController,
    playgroundsController
  )

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-800 py-8">
        <PlaygroundPageHero />
        <AddPlaygroundButton />
      </div>
      <PlaygroundCards initialPlaygrounds={playgrounds} />
    </div>
  )
}
