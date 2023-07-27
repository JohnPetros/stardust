import { useMemo } from 'react'
import { useAuth } from './useAuth'
import useSWR, { mutate } from 'swr'

import { Rocket } from '@/types/rocket'
import { api } from '@/services/api'

export function useRocket(rocketId?: string) {
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

  const { data: rocket } = useSWR(rocketId ? 'rocket' : null, getRocket)
  const { data: rockets } = useSWR(!rocketId ? 'rocket' : null, getRockets)
  const { data: userAcquiredRocketsIds } = useSWR(
    !rocketId ? 'users_acquired_rockets_ids' : null,
    getUserAcquiredRocketsIds
  )

  function updateRockets(updatedRocket: Rocket) {
    return rockets?.map((rocket) =>
      rocket.id === updatedRocket.id
        ? { ...updatedRocket, isAcquired: true }
        : rocket
    )
  }

  async function addUserAcquiredRocket(rocketId: string) {
    try {
      if (user?.id) {
        await api.addUserAcquiredRocket(rocketId, user?.id)
        const updatedRocket = rockets?.find((rocket) => rocket.id === rocketId)

        if (updatedRocket) {
          mutate({ ...updateRockets(updatedRocket) })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log(rockets);
  console.log(userAcquiredRocketsIds);

  const verifiedRockets = useMemo(() => {
    if (!rocketId && userAcquiredRocketsIds?.length && rockets?.length) {
      return rockets?.map((rocket) =>
        verifyRocketAcquirement(rocket, userAcquiredRocketsIds)
      )
    }

    return []
  }, [rockets?.length, userAcquiredRocketsIds?.length])

  return {
    rocket,
    rockets: verifiedRockets,
    addUserAcquiredRocket
  }
}
