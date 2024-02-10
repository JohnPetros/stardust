import { _handleUserPlaygroudsPage } from './actions/_handleUserPlaygroundPage'
import { AddPlaygroundButton } from './components/AddPlaygroundButton'
import { Hero } from './components/Hero'
import { PlaygroundCard } from './components/PlaygroundCard'

import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthController } from '@/services/api/supabase/controllers/SupabaseAuthController'
import { SupabasePlaygroundsController } from '@/services/api/supabase/controllers/SupabasePlaygroundsController'

export default async function UserPlaygroundsPage() {
  const supabase = SupabaseServerClient()
  const authController = SupabaseAuthController(supabase)
  const playgroundsController = SupabasePlaygroundsController(supabase)

  const playgrounds = await _handleUserPlaygroudsPage(
    authController,
    playgroundsController
  )

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-800 py-8">
        <Hero />
        <AddPlaygroundButton />
      </div>
      <div className="mx-auto mt-3 grid max-w-4xl grid-cols-2 gap-2">
        {playgrounds.map((playground) => (
          <PlaygroundCard
            key={playground.id}
            id={playground.id}
            title={playground.title}
          />
        ))}
      </div>
    </div>
  )
}
