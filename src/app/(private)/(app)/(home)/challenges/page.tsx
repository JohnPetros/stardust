import { Suspense } from 'react'

import { _handleChalengesPage } from './actions/_handleChallengesPage'
import { ChallengesFilters } from './components/ChallengesFilters'
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
      <div className="mx-auto mt-10 max-w-2xl px-6 pb-40 md:px-0">
        <ChallengesFilters categories={categories} />

        <ChallengesList categories={categories} />
      </div>
    </Suspense>
  )
}
