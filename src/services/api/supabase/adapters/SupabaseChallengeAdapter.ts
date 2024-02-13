import type { SupabaseChallenge } from '../types/SupabaseChallenge'

import {
  type Challenge,
  type ChallengeDifficulty,
  type ChallengeTestCase,
} from '@/@types/Challenge'
import { Text } from '@/@types/Text'

export const SupabaseChallengeAdapter = (
  supabaseChallenge: SupabaseChallenge
) => {
  const challenge: Challenge = {
    id: supabaseChallenge.id ?? '',
    title: supabaseChallenge.title ?? 'Sem título',
    code: supabaseChallenge.code ?? '',
    slug: supabaseChallenge.slug ?? '',
    userSlug: supabaseChallenge.user_slug ?? '',
    difficulty: (supabaseChallenge.difficulty as ChallengeDifficulty) ?? 'easy',
    createdAt: supabaseChallenge.created_at ?? '',
    functionName: supabaseChallenge.function_name ?? null,
    texts: supabaseChallenge.texts as Text[],
    starId: supabaseChallenge.star_id,
    testCases: supabaseChallenge.test_cases as ChallengeTestCase[],
    docId: supabaseChallenge.doc_id,
    totalCompletitions: supabaseChallenge.total_completitions ?? 0,
    categories: supabaseChallenge.categories,
    upvotesCount: supabaseChallenge.upvotes ?? 0,
    downvotesCount: supabaseChallenge.downvotes ?? 0,
    description: '',
  }

  return challenge
}
