'use client'
import { useMemo } from 'react'
import useSWR, { mutate } from 'swr'

import { FilterOptions } from '@/@types/filterOptions'
import { Order } from '@/@types/order'
import { Rocket } from '@/@types/rocket'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'
import { calculatePage } from '@/utils/helpers'

interface useRocketsListParams extends FilterOptions {
  priceOrder: Order
}

export function useRocketsList({
  offset,
  limit,
  search,
  priceOrder,
}: useRocketsListParams) {
  const api = useApi()

  const { user } = useAuth()

  const page = calculatePage(offset, limit)

  function verifyRocketAcquirement(
    rocket: Rocket,
    userAcquiredRocketsIds: string[]
  ) {
    const isAcquired = userAcquiredRocketsIds.some(
      (userAcquiredRocketsId) => userAcquiredRocketsId === rocket.id
    )

    return { ...rocket, isAcquired }
  }

  console.log(search)

  async function getRockets() {
    return await api.getRockets({
      search,
      offset,
      limit: offset + limit,
      priceOrder,
    })
  }

  async function getUserAcquiredRocketsIds() {
    if (user?.id) {
      return await api.getUserAcquiredRocketsIds(user.id)
    }
  }

  const { data: rockets } = useSWR(
    () => `/rockets?page=${page}&search=${search}`,
    getRockets
  )

  const { data: userAcquiredRocketsIds } = useSWR(
    user?.id ? '/users_acquired_rockets_ids' : null,
    getUserAcquiredRocketsIds
  )

  const verifiedRockets = useMemo(() => {
    if (rockets?.length && userAcquiredRocketsIds?.length) {
      return rockets?.map((rocket) =>
        verifyRocketAcquirement(rocket, userAcquiredRocketsIds)
      )
    }

    return []
  }, [rockets, userAcquiredRocketsIds])

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
      const updatedRocket = rockets?.find((rocket) => rocket.id === rocketId)

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

  return {
    rockets: verifiedRockets,
    addUserAcquiredRocket,
  }
}
