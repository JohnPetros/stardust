'use client'
import { useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'

import { Order } from '@/@types/order'
import { Rocket } from '@/@types/rocket'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useApi } from '@/services/api'
import { calculatePage } from '@/utils/helpers'

const ITEMS_PER_PAGE = 6

export function useRocketsList() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<Order>('ascending')

  const api = useApi()
  const { user } = useAuthContext()

  const page = calculatePage(offset, ITEMS_PER_PAGE)

  function verifyRocketAcquirement(
    rocket: Rocket,
    userAcquiredRocketsIds: string[]
  ) {
    const isAcquired = userAcquiredRocketsIds.some(
      (userAcquiredRocketsId) => userAcquiredRocketsId === rocket.id
    )

    return { ...rocket, isAcquired }
  }

  async function getRockets() {
    if (user?.id)
      return await api.getRockets({
        search,
        offset,
        limit: offset + ITEMS_PER_PAGE - 1,
        priceOrder,
        userId: user.id,
        shouldFetchUnlocked: null,
      })
  }

  async function getUserAcquiredRocketsIds() {
    if (user?.id) {
      return await api.getUserAcquiredRocketsIds(user.id)
    }
  }

  const { data } = useSWR(
    () =>
      `/rockets?page=${page}&search=${search}&priceOrder=${priceOrder}&user_id=${user?.id}`,
    getRockets
  )

  const { data: userAcquiredRocketsIds } = useSWR(
    user?.id ? '/users_acquired_rockets_ids' : null,
    getUserAcquiredRocketsIds
  )

  const verifiedRockets = useMemo(() => {
    if (data?.rockets.length && userAcquiredRocketsIds?.length) {
      return data?.rockets.map((rocket) =>
        verifyRocketAcquirement(rocket, userAcquiredRocketsIds)
      )
    }

    return []
  }, [data, userAcquiredRocketsIds])

  function updateRockets(updatedRocket: Rocket) {
    return verifiedRockets?.map((rocket) => {
      if (rocket.id === updatedRocket.id) {
        return { ...rocket, isAcquired: true }
      }
      return rocket
    })
  }

  async function addUserAcquiredRocket(rocketId: string) {
    if (user?.id) {
      const error = await api.addUserAcquiredRocket(rocketId, user?.id)
      const updatedRocket = data?.rockets.find(
        (rocket) => rocket.id === rocketId
      )

      if (error) {
        throw new Error(error)
      }

      if (updatedRocket && userAcquiredRocketsIds) {
        const updatedRockets = updateRockets(updatedRocket)

        mutate('/rockets', updatedRockets, false)

        mutate(
          '/users_acquired_rockets_ids',
          [...userAcquiredRocketsIds, updatedRocket.id],
          false
        )
      }
    }
  }

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
    rockets: verifiedRockets,
    count: data?.count,
    offset,
    setOffset,
    addUserAcquiredRocket,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
