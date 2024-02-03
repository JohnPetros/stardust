import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

import { AvatarItemProps } from '../AvatarItem'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useAudio } from '@/hooks/useAudio'
import { getImage } from '@/utils/helpers'

export function useAvatarItem({
  data: { id, name, price, image, isAcquired },
  addUserAcquiredAvatar,
}: AvatarItemProps) {
  const { user, updateUser } = useAuthContext()

  const { mutate } = useSWRConfig()

  const [isSelected, setIsSelected] = useState(false)

  const audio = useAudio('switch.wav')

  const avatarImage = getImage('avatars', image)
  const isBuyable = user ? user?.coins >= price : false

  async function handleShopSuccess() {
    if (user)
      await Promise.all([
        updateUser({
          coins: user.coins - price,
        }),
        addUserAcquiredAvatar(id),
      ])
  }

  async function buyAvatar() {
    if (!isBuyable || !user) {
      return
    }

    try {
      await selectAvatar()
    } catch (error) {
      console.error(error)
    }
  }

  async function selectAvatar() {
    try {
      await updateUser({ avatar_id: id })
      audio?.play()
      mutate('/avatar?id=' + id, { id, name, image })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleShopButton() {
    if (isAcquired) {
      await selectAvatar()
      return
    }

    await buyAvatar()
  }

  useEffect(() => {
    setIsSelected(id === user?.avatar_id)
  }, [id, user?.avatar_id])

  return {
    isSelected,
    isBuyable,
    avatarImage,
    handleShopSuccess,
    handleShopButton,
  }
}
