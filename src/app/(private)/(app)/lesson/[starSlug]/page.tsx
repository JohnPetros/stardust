import { Layout } from '../components/Layout'

import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'

interface LessonPageProps {
  params: { starSlug: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = createServerClient()
  const starController = StarsController(supabase)

  const star = await starController.getStarBySlug(params.starSlug)

  return <Layout star={star} />
}
