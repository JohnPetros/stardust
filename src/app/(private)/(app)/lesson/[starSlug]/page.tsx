import { notFound } from 'next/navigation'

import { LessonStar } from '../components/LessonStar'

import type { Star } from '@/@types/star'
import { MdxController } from '@/services/api/server/controllers/mdxController'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { StarsController } from '@/services/api/supabase/controllers/starsController'
import { ERRORS } from '@/utils/constants'

let star: Star
let compiledMdxComponents: string[]

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
    const mdxComponents = await mdxController.parseTexts(star.texts)
    compiledMdxComponents =
      await mdxController.compileMdxComponents(mdxComponents)

    console.log(compiledMdxComponents[0])

    if (!compiledMdxComponents.length) throw new Error()
  } catch (error) {
    console.error(ERRORS.mdx.failedCompiling)
  }

  return <LessonStar star={star} mdxComponets={compiledMdxComponents} />
}
