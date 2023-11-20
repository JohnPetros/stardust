import { createClient } from 'supabase/supabase-server'

import { Layout } from '../components/Layout'

import { StarService } from '@/services/api/starService'

type LessonProps = {
  params: { starId: string }
}

export default async function Lesson({ params }: LessonProps) {
  const supabase = createClient()
  const starService = StarService(supabase)

  const star = await starService.getStar(params.starId)

  return <Layout star={star} />
}
