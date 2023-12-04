import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProfileCreationMessage } from '../../components/ProfileCreationMessage'

import { AuthService } from '@/services/api/authService'
import { ROUTES } from '@/utils/constants'

interface EmailConfirmationPageProps {
  params: { token: string | null }
}

export default async function EmailConfirmationPage({
  params,
}: EmailConfirmationPageProps) {
  // const token = params.token

  // if (!token) return redirect(ROUTES.public.signIn)
  // const cookieStore = cookies()
  // const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  // const authService = AuthService(supabase)
  // const user = await authService.confirmEmail(token)

  // if (!user) return redirect(ROUTES.public.signIn)
  // console.log(user.id)

  return <ProfileCreationMessage />
}
