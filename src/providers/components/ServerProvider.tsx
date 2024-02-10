import { ReactNode } from 'react'

import { AuthProvider } from '@/contexts/AuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'

type ServerProps = {
  children: ReactNode
}

export async function ServerProvider({ children }: ServerProps) {
  const supabase = SupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const serverSession = session ? { user: { id: session.user.id } } : null

  return (
    <SupabaseProvider>
      <AuthProvider serverSession={serverSession}>{children}</AuthProvider>
    </SupabaseProvider>
  )
}
