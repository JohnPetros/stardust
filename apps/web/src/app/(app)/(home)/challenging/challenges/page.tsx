import { SupabaseServerClient } from '@/api/supabase/clients/SupabaseServerClient'
import { SupabaseChallengingService } from '@/api/supabase/services'
import { ChallengesPage } from '@/ui/challenging/widgets/pages/Challenges'

export default async function Page() {
  const supabase = SupabaseServerClient()
  const challengingService = SupabaseChallengingService(supabase)
  const response = await challengingService.fetchCategories()
  if (response.isFailure) response.throwError()
  const categoriesDto = response.body

  return <ChallengesPage categoriesDto={categoriesDto} />
}
