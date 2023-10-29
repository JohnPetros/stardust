'use client'

import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import useSWR, { mutate } from 'swr'

import { useApi } from '@/services/api'

import type { Avatar } from '@/@types/avatar'

export function useAvatar(avatarId?: string) {
  const api = useApi()
  const { user } = useAuth()

  async function getUserAcquiredAvatarsIds() {
    if (user?.id) {
      return await api.getUserAcquiredAvatarsIds(user.id)
    }
  }

  async function getAvatar() {
    if (avatarId) {
      return await api.getAvatar(avatarId)
    }
  }

  async function getAvatars() {
    if (!avatarId) {
      return await api.getAvatars()
    }
  }

  const { data: avatar } = useSWR(
    avatarId ? '/avatar?id=' + avatarId : null,
    getAvatar
  )
  const { data: avatars } = useSWR(!avatarId ? '/avatars' : null, getAvatars)
  const { data: userAcquiredAvatarsIds } = useSWR(
    !avatarId ? '/users_acquired_avatars_ids' : null,
    getUserAcquiredAvatarsIds
  )

  function updateAvatars(updatedAvatar: Avatar) {
    return avatars?.map((avatar) =>
      avatar.id === updatedAvatar.id
        ? { ...updatedAvatar, isAcquired: true }
        : avatar
    )
  }

  async function addUserAcquiredAvatar(avatarId: string) {
    if (user?.id) {
      const error = await api.addUserAcquiredAvatar(avatarId, user.id)
      const updatedAvatar = avatars?.find((avatar) => avatar.id === avatarId)
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
    if (!avatarId && userAcquiredAvatarsIds?.length && avatars?.length) {
      return avatars?.map((avatar) =>
        verifyAvatarAcquirement(avatar, userAcquiredAvatarsIds)
      )
    }

    return []
  }, [avatars, userAcquiredAvatarsIds])

  return {
    avatar: avatar,
    avatars: verifiedAvatars,
    addUserAcquiredAvatar,
  }
}
