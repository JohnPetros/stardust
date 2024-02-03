import { useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'

import type { Avatar } from '@/@types/avatar'
import type { Order } from '@/@types/order'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useApi } from '@/services/api'
import { calculatePage } from '@/utils/helpers'

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
    return await api.getAvatars({
      search,
      offset,
      limit: offset + ITEMS_PER_PAGE - 1,
      priceOrder,
    })
  }

  const { data } = useSWR(
    () => `/avatars?page=${page}&search=${search}&priceOrder=${priceOrder}`,
    getAvatars
  )

  const { data: userAcquiredAvatarsIds } = useSWR(
    user?.id ? '/users_acquired_avatars_ids' : null,
    getUserAcquiredAvatarsIds
  )

  function updateAvatars(updatedAvatar: Avatar) {
    return data?.avatars.map((avatar) =>
      avatar.id === updatedAvatar.id
        ? { ...updatedAvatar, isAcquired: true }
        : avatar
    )
  }

  async function addUserAcquiredAvatar(avatarId: string) {
    if (user?.id) {
      const error = await api.addUserAcquiredAvatar(avatarId, user.id)
      const updatedAvatar = data?.avatars.find(
        (avatar) => avatar.id === avatarId
      )
      const updatedAvatars = updatedAvatar ? updateAvatars(updatedAvatar) : null

      if (error) {
        throw Error(error)
      }

      if (updatedAvatar && userAcquiredAvatarsIds) {
        mutate('/avatars', updatedAvatars, false)

        mutate(
          '/users_acquired_avatars_ids',
          [...userAcquiredAvatarsIds, updatedAvatar.id],
          false
        )
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
