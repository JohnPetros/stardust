import { _handlePlaygroundPage } from './actions/_handlePlaygroundPage'
import { PlaygroundLayout } from './components/PlaygroundLayout'

import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabasePlaygroundsController } from '@/services/api/supabase/controllers/SupabasePlaygroundsController'

type UserPlaygroundPageProps = {
  params: { playgroundId: string }
}

export default async function PlaygroundPage({
  params: { playgroundId },
}: UserPlaygroundPageProps) {
  const supabase = SupabaseServerClient()
  const playgroudsController = SupabasePlaygroundsController(supabase)

  const playground = await _handlePlaygroundPage(
    playgroundId,
    playgroudsController
  )

  return (
    <>
      <PlaygroundLayout
        playgroundId={playground.id}
        playgroundTitle={playground.title}
        playgroundCode={playground.code ?? ''}
        playgroundUser={playground.user ?? null}
        isPlaygroundPublic={playground.isPublic}
      />
    </>
  )
}
