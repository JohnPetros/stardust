'use client'

import { Solution } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import type { TabListSorter } from '../../TabListSorter'
import { useApi } from '@/ui/global/hooks/useApi'

const SOLUTIONS_PER_PAGE = 10

export function useSolutionsListTab(tabListSorter: TabListSorter, userId: string) {
  const api = useApi()

  async function fetchSolutionsList(page: number) {
    const response = await api.fetchSolutionsList({
      page,
      title: '',
      itemsPerPage: SOLUTIONS_PER_PAGE,
      sorter: tabListSorter,
      userId: userId,
      challengeId: null,
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.solutionsList,
    fetcher: fetchSolutionsList,
    itemsPerPage: SOLUTIONS_PER_PAGE,
    isInfinity: true,
    dependencies: [tabListSorter],
  })

  return {
    solutions: data.map(Solution.create),
    isRecheadedEnd,
    isLoading,
    nextPage,
  }
}
