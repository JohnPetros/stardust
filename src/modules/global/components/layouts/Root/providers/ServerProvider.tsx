import { ReactNode } from 'react'

import { SupabaseServerClient } from '@/infra/api/supabase/clients'

import { SupabaseProvider } from '@/modules/global/contexts/SupabaseContext'
import { ToastProvider } from '@/modules/global/contexts/ToastContext'
import { AuthProvider } from '@/modules/global/contexts/AuthContext'

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
      <ToastProvider>
        <AuthProvider serverSession={serverSession}>{children}</AuthProvider>
      </ToastProvider>
    </SupabaseProvider>
  )
}
