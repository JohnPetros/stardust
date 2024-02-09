import { AddPlaygroundButton } from './components/AddPlaygroundButton'
import { Hero } from './components/Hero'
import { PlaygroundCard } from './components/PlaygroundCard'

import { createSupabaseServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { PlaygroundsController } from '@/services/api/supabase/controllers/playgroundsController'
import { ERRORS } from '@/utils/constants'

export default async function PlaygroundPage() {
  const supabase = createSupabaseServerClient()
  const authController = AuthController(supabase)
  const userId = await authController.getUserId()

  if (!userId) throw new Error(ERRORS.auth.userNotFound)

  const playgroundsController = PlaygroundsController(supabase)

  const playgrounds = await playgroundsController.getPlaygroundsByUserId(userId)

  console.log({ playgrounds })

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
