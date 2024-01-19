import { Suspense } from 'react'

import { ChallengesList } from './components/ChallengesList'

import { Category } from '@/@types/category'
import { Loading } from '@/app/components/Loading'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { CategoriesController } from '@/services/api/supabase/controllers/categoriesController'
import { ERRORS } from '@/utils/constants'

let categories: Category[]

export default async function ChallengesPage() {
  const categoriesController = CategoriesController(createServerClient())

  try {
    categories = await categoriesController.getCategories()
  } catch (error) {
    console.error(error)
    throw new Error(ERRORS.categoriesFailedFetching)
  }

  return (
    <Suspense fallback={<Loading isSmall={false} />}>
      <ChallengesList categories={categories} />
    </Suspense>
  )
}
