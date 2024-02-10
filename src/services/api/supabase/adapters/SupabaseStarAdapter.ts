import type { SupabaseStar } from '../types/SupabaseStar'

import { Question } from '@/@types/Quiz'
import type { Star } from '@/@types/Star'
import type { Text } from '@/@types/Text'

export const SupabaseStarAdapter = (supabaseStar: SupabaseStar) => {
  const texts = (supabaseStar.texts as Text[]) ?? []
  const questions = (supabaseStar.questions as Question[]) ?? []

  const star: Star = {
    id: supabaseStar.id,
    slug: supabaseStar.slug,
    name: supabaseStar.name,
    number: supabaseStar.number,
    planetId: supabaseStar.planet_id,
    texts,
    questions,
  }

  return star
}
