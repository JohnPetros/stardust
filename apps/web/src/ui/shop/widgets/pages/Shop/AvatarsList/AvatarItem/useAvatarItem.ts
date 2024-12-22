'use client'

import { useApi } from '@/ui/global/hooks'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { playAudio } from '@/utils'
import { Avatar } from '@stardust/core/shop/entities'

type UseAvatarItemProps = {
  id: string
  name: string
  image: string
  price: number
}

export function useAvatarItem({ id, name, price, image }: UseAvatarItemProps) {
  const { user, updateUser } = useAuthContext()

  const toast = useToastContext()
  const api = useApi()

  async function handleShopButtonBuy() {
    if (!user) return

    const response = await api.saveAcquiredAvatar(id, user.id)

    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    await updateUser(user)
  }

  async function handleShopButtonClick() {
    if (!user) return

    const currentAcquiredAvatarsCount = user.acquiredAvatarsCount

    user.buyAvatar(Avatar.create({ id, name, image, price }))

    if (currentAcquiredAvatarsCount.value === user.acquiredAvatarsCount.value) {
      await updateUser(user)
      playAudio('switch.wav')
    }
  }

  return {
    handleShopButtonBuy,
    handleShopButtonClick,
  }
}
