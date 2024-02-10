import { _checkPublicPlayground } from './actions/_checkPublicPlayground'
import { _getPlaygroundById } from './actions/_getPlaygroundById'
import { NotPublicPlayground } from './components/NotPublicPlayground'
import { PlaygroundLayout } from './components/PlaygroundLayout'

import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthController } from '@/services/api/supabase/controllers/SupabaseAuthController'
import { SupabasePlaygroundsController } from '@/services/api/supabase/controllers/SupabasePlaygroundsController'

type UserPlaygroundPageProps = {
  params: { playgroundId: string }
}

export default async function PlaygroundPage({
  params: { playgroundId },
}: UserPlaygroundPageProps) {
  const supabase = SupabaseServerClient()
  const playgroudsController = SupabasePlaygroundsController(supabase)
  const authController = SupabaseAuthController(supabase)

  const playground = await _getPlaygroundById(
    playgroundId,
    playgroudsController
  )

  const isPlaygroundPublic = await _checkPublicPlayground(
    playground,
    authController
  )

  if (!isPlaygroundPublic) return <NotPublicPlayground />

  return (
    <PlaygroundLayout
      playgroundId={playground.id}
      playgroundTitle={playground.title}
      playgroundCode={playground.code ?? ''}
      playgroundUser={playground.user ?? null}
      isPlaygroundPublic={playground.isPublic}
    />
  )
}
