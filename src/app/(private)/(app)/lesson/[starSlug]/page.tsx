import { _handleLessonPage } from '../actions/_handleLessonPage'
import { LessonStar } from '../components/LessonStar'

import { texts } from '@/__tests__/mocks/lesson/planets/planet7/star1/texts'
import { APP_ERRORS } from '@/global/constants'
import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthController } from '@/services/api/supabase/controllers/SupabaseAuthController'
import { SupabaseStarsController } from '@/services/api/supabase/controllers/SupabaseStarsController'

type LessonPageProps = {
  params: { starSlug: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = SupabaseServerClient()
  const starController = SupabaseStarsController(supabase)
  const authController = SupabaseAuthController(supabase)
  const userId = await authController.getUserId()

  if (!userId) throw new Error(APP_ERRORS.auth.userNotFound)

  const star = await _handleLessonPage(userId, params.starSlug, starController)

  const _star = {
    ...star,
    texts,
  }

  return <LessonStar star={_star} />
}
