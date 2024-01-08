import '../../libs/dayjs'

import { ReactNode } from 'react'

import { AuthProvider } from '@/contexts/AuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'

interface ServerProps {
  children: ReactNode
}

export async function Server({ children }: ServerProps) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <SupabaseProvider>
      <AuthProvider serverSession={session}>{children}</AuthProvider>
    </SupabaseProvider>
  )
}
