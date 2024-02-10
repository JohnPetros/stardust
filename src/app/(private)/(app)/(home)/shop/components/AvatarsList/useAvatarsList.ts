import { useMemo, useState } from 'react'

import type { Avatar } from '@/@types/Avatar'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { APP_ERRORS } from '@/global/constants'
import { CACHE } from '@/global/constants/cache'
import { calculatePage } from '@/global/helpers'
import { useApi } from '@/services/api'
import { Order } from '@/services/api/types/Order'
import { useCache } from '@/services/cache'

const ITEMS_PER_PAGE = 8

export function useAvatarsList() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<Order>('ascending')

  const { user } = useAuthContext()
  const api = useApi()
  const page = calculatePage(offset, ITEMS_PER_PAGE)

  async function getUserAcquiredAvatarsIds() {
    if (user?.id) {
      return await api.getUserAcquiredAvatarsIds(user.id)
    }
  }

  async function getAvatars() {
    return await api.getFilteredAvatars({
      search,
      offset,
      limit: offset + ITEMS_PER_PAGE - 1,
      priceOrder,
    })
  }

  const { data, mutate: mutateAvatars } = useCache({
    key: CACHE.keys.filteredAvatars,
    fetcher: getAvatars,
    dependencies: [page, search, priceOrder],
  })

  const { data: userAcquiredAvatarsIds, mutate: mutateAcquiredAvatarsIds } =
    useCache({
      key: CACHE.keys.acquiredAvatarsIds,
      fetcher: getUserAcquiredAvatarsIds,
      isEnabled: Boolean(user?.id),
    })

  function updateAvatars(updatedAvatar: Avatar) {
    return data?.avatars.map((avatar) =>
      avatar.id === updatedAvatar.id
        ? { ...updatedAvatar, isAcquired: true }
        : avatar
    )
  }

  async function addUserAcquiredAvatar(avatarId: string) {
    if (user?.id) {
      try {
        await api.addUserAcquiredAvatar(avatarId, user.id)
      } catch (error) {
        console.error(error)
        throw Error(APP_ERRORS.avatars.failedAcquiring)
      }
      const updatedAvatar = data?.avatars.find(
        (avatar) => avatar.id === avatarId
      )
      const updatedAvatars = updatedAvatar ? updateAvatars(updatedAvatar) : null

      if (updatedAvatar && userAcquiredAvatarsIds) {
        if (updatedAvatars)
          mutateAvatars({
            avatars: updatedAvatars,
            count: data?.count ?? ITEMS_PER_PAGE,
          })

        mutateAcquiredAvatarsIds([...userAcquiredAvatarsIds, updatedAvatar.id])
      }
    }
  }

  function verifyAvatarAcquirement(
    avatar: Avatar,
    userAcquiredAvatarsIds: string[]
  ) {
    const isAcquired = userAcquiredAvatarsIds.some(
      (userAcquiredAvatarsId) => userAcquiredAvatarsId === avatar.id
    )

    return { ...avatar, isAcquired }
  }

  const verifiedAvatars = useMemo(() => {
    if (userAcquiredAvatarsIds?.length && data?.avatars.length) {
      return data?.avatars.map((avatar) =>
        verifyAvatarAcquirement(avatar, userAcquiredAvatarsIds)
      )
    }

    return []
  }, [data, userAcquiredAvatarsIds])

  function handleSearchChange(value: string) {
    if (value.length) {
      setSearch(value)
      setOffset(0)
    }
  }

  function handlePriceOrderChange(value: Order) {
    setPriceOrder(value)
  }

  return {
    avatars: verifiedAvatars,
    itemsPerAge: ITEMS_PER_PAGE,
    totalItems: data?.count ?? 0,
    search,
    offset,
    setOffset,
    addUserAcquiredAvatar,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
