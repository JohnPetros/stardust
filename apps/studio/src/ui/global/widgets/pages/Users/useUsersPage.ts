import { useMemo } from 'react'

import {
  OrdinalNumber,
  Period,
  ListingOrder,
  Text,
} from '@stardust/core/global/structures'
import { SpaceCompletionStatus } from '@stardust/core/profile/structures'
import { InsigniaRole } from '@stardust/core/global/structures'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { useFetch } from '@/ui/global/hooks/useFetch'
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
  const [levelOrder, setLevelOrder] = useQueryStringParam('levelOrder', 'any')
  const [xpOrder, setXpOrder] = useQueryStringParam('xpOrder', 'any')
  const [starsOrder, setStarsOrder] = useQueryStringParam('starsOrder', 'any')
  const [achievementsOrder, setAchievementsOrder] = useQueryStringParam(
    'achievementsOrder',
    'any',
  )
  const [challengesOrder, setChallengesOrder] = useQueryStringParam(
    'challengesOrder',
    'any',
  )

  const orders = useMemo(
    () => ({
      level: ListingOrder.create(levelOrder),
      weeklyXp: ListingOrder.create(xpOrder),
      unlockedStarCount: ListingOrder.create(starsOrder),
      unlockedAchievementCount: ListingOrder.create(achievementsOrder),
      completedChallengeCount: ListingOrder.create(challengesOrder),
    }),
    [levelOrder, xpOrder, starsOrder, achievementsOrder, challengesOrder],
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

  const { data, isLoading, refetch } = useFetch({
    key: CACHE.usersTable.key,
    dependencies: [
      debouncedSearch,
      page,
      itemsPerPage,
      orders,
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
        levelOrder: orders.level,
        weeklyXpOrder: orders.weeklyXp,
        unlockedStarCountOrder: orders.unlockedStarCount,
        unlockedAchievementCountOrder: orders.unlockedAchievementCount,
        completedChallengeCountOrder: orders.completedChallengeCount,
        insigniaRoles: insigniaRoles.map((role) => InsigniaRole.create(role)),
        creationPeriod: period,
        spaceCompletionStatus,
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

  function handleOrderChange(column: string, order: ListingOrder) {
    const orderValue = order.value as 'ascending' | 'descending' | 'any'

    switch (column) {
      case 'level':
        setLevelOrder(orderValue)
        break
      case 'weeklyXp':
        setXpOrder(orderValue)
        break
      case 'unlockedStarCount':
        setStarsOrder(orderValue)
        break
      case 'unlockedAchievementCount':
        setAchievementsOrder(orderValue)
        break
      case 'completedChallengeCount':
        setChallengesOrder(orderValue)
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

  return {
    users: data?.items ?? [],
    isLoading,
    totalItemsCount: data?.totalItemsCount ?? 0,
    totalPages,
    page,
    itemsPerPage,
    orders,
    spaceCompletionStatus,
    insigniaRoles,
    creationPeriod,
    handleNextPage,
    handlePrevPage,
    handleSearchChange,
    handleOrderChange,
    handleSpaceCompletionStatusChange,
    handleInsigniaRolesChange,
    handleCreationPeriodChange,
    handlePageChange,
    handleItemsPerPageChange,
    refetch,
  }
}
