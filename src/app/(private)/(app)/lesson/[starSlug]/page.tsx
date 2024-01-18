import { notFound } from 'next/navigation'

import { LessonStar } from '../components/LessonStar'

import type { Star } from '@/@types/star'
import { MdxController } from '@/services/api/server/controllers/mdxController'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'

type LessonPageProps = {
  params: { starSlug: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = createServerClient()
  const starController = StarsController(supabase)

  let star: Star

  try {
    star = await starController.getStarBySlug(params.starSlug)
  } catch (error) {
    console.error(error)
    notFound()
  }

  const mdxController = MdxController()
  const mdxComponents = await mdxController.parseTexts(star.texts)
  const compiledMdxComponents =
    await mdxController.compileMdxComponents(mdxComponents)

  return <LessonStar star={star} mdxComponets={compiledMdxComponents} />
}
