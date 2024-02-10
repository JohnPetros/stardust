import { Suspense } from 'react'

import { _handleChalengesPage } from './actions/_handleChallengesPage'
import { ChallengesList } from './components/ChallengesList'

import { Loading } from '@/global/components/Loading'
import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseCategoriesController } from '@/services/api/supabase/controllers/SupabaseCategoriesController'

export default async function ChallengesPage() {
  const categoriesController = SupabaseCategoriesController(
    SupabaseServerClient()
  )

  const categories = await _handleChalengesPage(categoriesController)

  return (
    <Suspense fallback={<Loading isSmall={false} />}>
      <ChallengesList categories={categories} />
    </Suspense>
  )
}
