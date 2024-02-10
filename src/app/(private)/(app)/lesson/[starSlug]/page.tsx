import { _handleLessonPage } from '../actions/_handleLessonPage'
import { LessonStar } from '../components/LessonStar'

import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseStarsController } from '@/services/api/supabase/controllers/SupabaseStarsController'

type LessonPageProps = {
  params: { starSlug: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = SupabaseServerClient()
  const starController = SupabaseStarsController(supabase)

  const star = await _handleLessonPage(params.starSlug, starController)

  return <LessonStar star={star} />
}
