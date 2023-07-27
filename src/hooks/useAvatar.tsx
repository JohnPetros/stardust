import { useMemo } from 'react'
import { useAuth } from './useAuth'
import useSWR from 'swr'

import { Avatar } from '@/types/avatar'
import { api } from '@/services/api'

export function useAvatar(avatarId?: string) {
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

  const { data: avatar } = useSWR('/avatar?id=' + user?.avatar_id, getAvatar)
  const { data: avatars, mutate } = useSWR(
    !avatarId ? '/avatars' : null,
    getAvatars
  )
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
      const error = await api.addUserAcquiredAvatar(avatarId, user?.id)
      const updatedAvatar = avatars?.find((avatar) => avatar.id === avatarId)

      if (updatedAvatar) {
        mutate({ ...avatars, ...updateAvatars(updatedAvatar)! })
      }

      return error
    }
    return null
  }

  console.log(avatars)
  console.log(userAcquiredAvatarsIds)

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
    console.log(!avatarId && userAcquiredAvatarsIds?.length && avatars?.length)

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
