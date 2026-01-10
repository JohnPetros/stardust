import { useMemo } from 'react'

import { OrdinalNumber, Period, Sorter, Text } from '@stardust/core/global/structures'
import { SpaceCompletionStatus } from '@stardust/core/profile/structures'
import { InsigniaRole } from '@stardust/core/global/structures'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { useCache } from '@/ui/global/hooks/useCache'
import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryNumberParam } from '@/ui/global/hooks/useQueryNumberParam'
import { useQueryStringArrayParam } from '@/ui/global/hooks/useQueryStringArrayParam'
import { CACHE } from '@/constants'
import { Datetime } from '@stardust/core/global/libs'

type Params = {
  service: ProfileService
}

export function useUsersPage({ service }: Params) {
  const [search, setSearch] = useQueryStringParam('q', '')
  const debouncedSearch = useDebounce(search, 500)
  const [page, setPage] = useQueryNumberParam('page', 1)
  const [itemsPerPage, setItemsPerPage] = useQueryNumberParam('limit', 10)
  const [levelSort, setLevelSort] = useQueryStringParam('levelSort', 'none')
  const [xpSort, setXpSort] = useQueryStringParam('xpSort', 'none')
  const [starsSort, setStarsSort] = useQueryStringParam('starsSort', 'none')
  const [achievementsSort, setAchievementsSort] = useQueryStringParam(
    'achievementsSort',
    'none',
  )
  const [challengesSort, setChallengesSort] = useQueryStringParam(
    'challengesSort',
    'none',
  )

  const sorters = useMemo(
    () => ({
      level: Sorter.create(levelSort),
      weeklyXp: Sorter.create(xpSort),
      unlockedStarCount: Sorter.create(starsSort),
      unlockedAchievementCount: Sorter.create(achievementsSort),
      completedChallengeCount: Sorter.create(challengesSort),
    }),
    [levelSort, xpSort, starsSort, achievementsSort, challengesSort],
  )

  const [statusParam, setStatusParam] = useQueryStringParam('status', 'all')
  const spaceCompletionStatus = useMemo(
    () => SpaceCompletionStatus.create(statusParam),
    [statusParam],
  )
  const [insigniaRoles, setInsigniaRoles] = useQueryStringArrayParam('roles', [])
  const [startDateParam, setStartDateParam] = useQueryStringParam('startDate', '')
  const [endDateParam, setEndDateParam] = useQueryStringParam('endDate', '')

  const creationPeriod = useMemo(() => {
    const result: { startDate?: Date; endDate?: Date } = {}
    if (startDateParam) result.startDate = new Date(startDateParam)
    if (endDateParam) result.endDate = new Date(endDateParam)
    return result
  }, [startDateParam, endDateParam])

  const { data, isLoading, refetch } = useCache({
    key: CACHE.usersTable.key,
    dependencies: [
      debouncedSearch,
      page,
      itemsPerPage,
      sorters,
      spaceCompletionStatus,
      insigniaRoles,
      creationPeriod,
    ],
    fetcher: async () => {
      const period =
        creationPeriod.startDate && creationPeriod.endDate
          ? Period.create(
              creationPeriod.startDate?.toISOString(),
              creationPeriod.endDate?.toISOString(),
            )
          : undefined
      return await service.fetchUsersList({
        search: Text.create(debouncedSearch),
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        levelSorter: sorters.level,
        weeklyXpSorter: sorters.weeklyXp,
        unlockedStarCountSorter: sorters.unlockedStarCount,
        unlockedAchievementCountSorter: sorters.unlockedAchievementCount,
        completedChallengeCountSorter: sorters.completedChallengeCount,
        spaceCompletionStatus,
        insigniaRoles: insigniaRoles.map((role) => InsigniaRole.create(role)),
        creationPeriod: period,
      })
    },
  })

  const totalPages = useMemo(() => {
    if (!data?.totalItemsCount) return 0
    return Math.ceil(data.totalItemsCount / itemsPerPage)
  }, [data?.totalItemsCount, itemsPerPage])

  function handleNextPage() {
    if (page < totalPages) setPage(page + 1)
  }

  function handlePrevPage() {
    if (page > 1) setPage(page - 1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleSort(column: string, sorter: Sorter) {
    const sorterValue = sorter.value as 'asc' | 'desc' | 'none'

    switch (column) {
      case 'level':
        setLevelSort(sorterValue)
        break
      case 'weeklyXp':
        setXpSort(sorterValue)
        break
      case 'unlockedStarCount':
        setStarsSort(sorterValue)
        break
      case 'unlockedAchievementCount':
        setAchievementsSort(sorterValue)
        break
      case 'completedChallengeCount':
        setChallengesSort(sorterValue)
        break
    }
    setPage(1)
  }

  function handleSpaceCompletionStatusChange(status: string) {
    setStatusParam(status)
    setPage(1)
  }

  function handleInsigniaRolesChange(roles: string[]) {
    setInsigniaRoles(roles)
    setPage(1)
  }

  function handleCreationPeriodChange(period: { startDate?: Date; endDate?: Date }) {
    setStartDateParam(
      period.startDate
        ? new Datetime(period.startDate.toISOString()).format('YYYY-MM-DD')
        : '',
    )
    setEndDateParam(
      period.endDate
        ? new Datetime(period.endDate.toISOString()).format('YYYY-MM-DD')
        : '',
    )
    setPage(1)
  }

  function handlePageChange(newPage: number) {
    setPage(newPage)
  }

  function handleItemsPerPageChange(count: number) {
    setItemsPerPage(count)
    setPage(1)
  }

  console.log('creationPeriod', creationPeriod)

  return {
    users: data?.items ?? [],
    isLoading,
    totalItemsCount: data?.totalItemsCount ?? 0,
    totalPages,
    page,
    itemsPerPage,
    sorters,
    spaceCompletionStatus,
    insigniaRoles,
    creationPeriod,
    handleNextPage,
    handlePrevPage,
    handleSearchChange,
    handleSort,
    handleSpaceCompletionStatusChange,
    handleInsigniaRolesChange,
    handleCreationPeriodChange,
    handlePageChange,
    handleItemsPerPageChange,
    refetch,
  }
}
