import type { SupabaseStar } from '../types/SupabaseStar'

import { Question } from '@/@types/Quiz'
import type { Star } from '@/@types/Star'
import type { Text } from '@/@types/Text'

export const SupabaseStarAdapter = (supabaseStar: SupabaseStar) => {
  const texts = (supabaseStar.texts as Text[]) ?? []
  const questions = (supabaseStar.questions as Question[]) ?? []

  console.log(supabaseStar.is_challenge)

  const star: Star = {
    id: supabaseStar.id,
    slug: supabaseStar.slug,
    name: supabaseStar.name,
    number: supabaseStar.number,
    planetId: supabaseStar.planet_id,
    isChallenge: supabaseStar.is_challenge,
    texts,
    questions,
  }

  return star
}
