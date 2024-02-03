import { notFound } from 'next/navigation'

import { LessonStar } from '../components/LessonStar'

import { texts } from '@/__tests__/mocks/lesson/planets/planet4/star1/texts'
import type { Star } from '@/@types/star'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'

let star: Star

type LessonPageProps = {
  params: { starSlug: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = createServerClient()
  const starController = StarsController(supabase)

  try {
    star = await starController.getStarBySlug(params.starSlug)
  } catch (error) {
    console.error(error)
    notFound()
  }

  const _star = {
    ...star,
    texts,
  }

  return <LessonStar star={_star} />
}
