import type { ReactNode } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { SupabaseServerClient } from '@/rest/supabase/clients/SupabaseServerClient'
import { SupabaseProvider } from '@/ui/global/contexts/SupabaseContext'
import { ToastProvider } from '@/ui/global/contexts/ToastContext'
import { AuthProvider } from '@/ui/auth/contexts/AuthContext'

type ServerProps = {
  children: ReactNode
}

export async function ServerProvider({ children }: ServerProps) {
  const supabase = SupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const serverSession = user ? { user: { id: user.id } } : null

  return (
    <SupabaseProvider>
      <NuqsAdapter>
        <ToastProvider>
          <AuthProvider serverSession={serverSession}>{children}</AuthProvider>
        </ToastProvider>
      </NuqsAdapter>
    </SupabaseProvider>
  )
}
