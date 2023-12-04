import { createClient } from 'supabase/supabase-server'

import { Layout } from '../components/Layout'

import { StarService } from '@/services/api/starService'

interface LessonPageProps {
  params: { starSlug: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = createClient()
  const starService = StarService(supabase)

  const star = await starService.getStarBySlug(params.starSlug)

  return <Layout star={star} />
}
