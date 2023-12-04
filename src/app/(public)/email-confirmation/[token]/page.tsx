import { redirect } from 'next/navigation'
import { createClient } from 'supabase/supabase-server'

import { ProfileCreationMessage } from '../../components/ProfileCreationMessage'

import { AuthService } from '@/services/api/authService'
import { ROUTES } from '@/utils/constants'

interface EmailConfirmationPageProps {
  params: { token: string | null }
}

export default function EmailConfirmationPage({
  params,
}: EmailConfirmationPageProps) {
  // const supabase = createClient()
  // const authService = AuthService(supabase)
  // const token = params.token

  // if (!token) return redirect(ROUTES.public.signIn)

  // const isAuthenticated = authService.confirmEmail(token)

  // if (!isAuthenticated) return redirect(ROUTES.public.signIn)

  return <ProfileCreationMessage />
}
