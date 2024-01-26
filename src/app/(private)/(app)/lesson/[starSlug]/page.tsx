import { notFound } from 'next/navigation'

import { LessonStar } from '../components/LessonStar'

import { texts } from '@/__tests__/mocks/lesson/planets/planet1/star3/texts'
import type { Star } from '@/@types/star'
import { MdxController } from '@/services/api/server/controllers/mdxController'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'
import { ERRORS } from '@/utils/constants'

let star: Star
let mdxComponents: string[]

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

  try {
    const mdxController = MdxController()
    // mdxComponents = await mdxController.parseTexts(star.texts)
    mdxComponents = await mdxController.parseTexts(texts)

    if (!mdxComponents.length) throw new Error()
  } catch (error) {
    console.error(ERRORS.mdx.failedCompiling)
  }

  return <LessonStar star={star} mdxComponets={mdxComponents} />
}
