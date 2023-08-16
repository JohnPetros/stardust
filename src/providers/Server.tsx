import { ReactNode } from 'react'

import { AuthProvider } from '@/contexts/AuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { createClient } from '@/services/supabase-server'

interface ServerProps {
  children: ReactNode
}

export async function Server({ children }: ServerProps) {
  const supabase = createClient()  
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  return (
    <SupabaseProvider>
      <AuthProvider serverSession={session}>{children}</AuthProvider>
    </SupabaseProvider>
  )
}
