import { useMemo } from 'react'
import { useAuth } from './useAuth'
import useSWR from 'swr'

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

  const verifiedRockets = useMemo(() => {
    if (!rocketId && userAcquiredRocketsIds?.length) {
      return rockets?.map((rocket) =>
        verifyRocketAcquirement(rocket, userAcquiredRocketsIds)
      )
    }

    return []
  }, [rockets, userAcquiredRocketsIds])

  return {
    rocket,
    rockets: verifiedRockets,
  }
}
