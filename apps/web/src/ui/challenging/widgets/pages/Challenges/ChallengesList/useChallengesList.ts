'use client'

import { ChallengeCompletion, ChallengeDifficulty } from '@/@core/domain/structs'

import { useApi } from '@/ui/global/hooks'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useUrlSearchParams } from ''@/ui/global/hooks'/useUrlSearchParams'
import type { _listChallenges } from './_listChallenges'
import { useCache } from '@/ui/global/hooks'
import { CACHE } from '@/constants'
import { SEARCH_PARAMS } from './search-params'
import { Challenge } from '@/@core/domain/entities'
import { ChallengeCategory } from '@/@core/domain/entities/ChallengeCategory'

export function useChallengesList(listChallenges: typeof _listChallenges) {
  const { user } = useAuthContext()
  const urlSearchParams = useUrlSearchParams()

  const difficulty = urlSearchParams.get(SEARCH_PARAMS.difficulty) ?? 'all'
  const completionStatus = urlSearchParams.get(SEARCH_PARAMS.status) ?? 'all'
  const title = urlSearchParams.get(SEARCH_PARAMS.title) ?? ''
  const categoriesIds = urlSearchParams.get(SEARCH_PARAMS.categoriesIds)

  async function fetchChallengesList() {
    if (!user) return

    const completion = ChallengeCompletion.create(completionStatus)
    const difficulty = ChallengeDifficulty.create(completionStatus)

    return await listChallenges(user.dto, completion.status, {
      categoriesIds: categoriesIds ? categoriesIds.split(',') : [],
      difficulty: difficulty.level,
      title,
    })
  }

  const { data, error, isLoading } = useCache({
    key: CACHE.keys.challengesList,
    fetcher: fetchChallengesList,
    dependencies: [completionStatus, difficulty, categoriesIds, title, user?.id],
  })

  return {
    challenges: data ? data.challengesDTO.map(Challenge.create) : [],
    categories: data ? data.categoriesDTO.map(ChallengeCategory.create) : [],
    isLoading,
    error,
  }
}
