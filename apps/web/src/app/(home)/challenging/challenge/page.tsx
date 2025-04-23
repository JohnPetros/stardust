import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseChallengingService } from '@/rest/supabase/services'
import { ChallengeEditorPage } from '@/ui/challenging/widgets/pages/ChallengeEditor'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = SupabaseServerClient()
  const challengingService = SupabaseChallengingService(supabase)
  const response = await challengingService.fetchCategories()
  if (response.isFailure) response.throwError()
  const categoriesDto = response.body

  return <ChallengeEditorPage challengeCategoriesDto={categoriesDto} />
}
