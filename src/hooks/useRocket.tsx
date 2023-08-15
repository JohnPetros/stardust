'use client'
import { useMemo } from 'react'
import { useAuth } from './useAuth'
import useSWR, { mutate } from 'swr'

import { Rocket } from '@/types/rocket'
import { useApi } from '@/services/api'

export function useRocket(rocketId?: string) {
  const api = useApi()

  const { user } = useAuth()

  function verifyRocketAcquirement(
    rocket: Rocket,
    userAcquiredRocketsIds: string[]
  ) {
    const isAcquired = userAcquiredRocketsIds.some(
      (userAcquiredRocketsId) => userAcquiredRocketsId === rocket.id
    )

    return { ...rocket, isAcquired }
  }

  async function getRocket() {
    if (rocketId) return await api.getRocket(rocketId)
  }

  async function getRockets() {
    if (!rocketId) return await api.getRockets()
  }

  async function getUserAcquiredRocketsIds() {
    if (!rocketId && user?.id) {
      return await api.getUserAcquiredRocketsIds(user.id)
    }
  } 

  const { data: rocket } = useSWR(
    rocketId ? '/rocket?id=' + rocketId : null,
    getRocket
  )

  const { data: rockets } = useSWR(!rocketId ? '/rockets' : null, getRockets)
  const { data: userAcquiredRocketsIds } = useSWR(
    !rocketId && user?.id ? '/users_acquired_rockets_ids' : null,
    getUserAcquiredRocketsIds
  )

  const verifiedRockets = useMemo(() => {
    if (!rocketId && rockets?.length && userAcquiredRocketsIds?.length) {
      return rockets?.map((rocket) =>
        verifyRocketAcquirement(rocket, userAcquiredRocketsIds)
      )
    }

    return []
  }, [rockets, userAcquiredRocketsIds])

  function updateRockets(updatedRocket: Rocket) {
    return verifiedRockets?.map((rocket) => {
      if (rocket.id === updatedRocket.id) {
        console.log(rocket)
        console.log(updatedRocket)

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
    rocket,
    rockets: verifiedRockets,
    addUserAcquiredRocket,
  }
}
