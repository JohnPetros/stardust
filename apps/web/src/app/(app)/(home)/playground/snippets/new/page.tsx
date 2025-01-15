import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseAuthService, SupabasePlaygroundService } from '@/api/supabase/services'
import type { NextParams } from '@/server/next/types'

export default async function Page({ params }: NextParams<{ playgroundId: string }>) {
  const supabase = SupabaseServerClient()
  const playgroudService = SupabasePlaygroundService(supabase)
  const authService = SupabaseAuthService(supabase)

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
