import { Solution } from '@stardust/core/challenging/entities'
import { OrdinalNumber, Text, Id } from '@stardust/core/global/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { SolutionsListingSorter } from '@stardust/core/challenging/structures'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import type { TabListSorter } from '../../TabListSorter'

const SOLUTIONS_PER_PAGE = OrdinalNumber.create(30)

export function useSolutionsListTab(
  service: ChallengingService,
  tabListSorter: TabListSorter,
  userId: string,
) {
  async function fetchSolutionsList(page: number) {
    const response = await service.fetchSolutionsList({
      page: OrdinalNumber.create(page),
      itemsPerPage: SOLUTIONS_PER_PAGE,
      title: Text.create(''),
      sorter: SolutionsListingSorter.create(tabListSorter),
      userId: Id.create(userId),
      challengeId: null,
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isRecheadedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.solutionsList,
    fetcher: fetchSolutionsList,
    itemsPerPage: SOLUTIONS_PER_PAGE.value,
    isInfinity: true,
    shouldRefetchOnFocus: false,
    dependencies: [tabListSorter],
  })

  return {
    solutions: data.map(Solution.create),
    isRecheadedEnd,
    isLoading,
    nextPage,
  }
}
