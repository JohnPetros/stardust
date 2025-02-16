'use client'

import { Rocket } from '@stardust/core/shop/entities'

import { useApi } from '@/ui/global/hooks/useApi'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAudioContext } from '@/ui/global/contexts/AudioContext'

type UseRocketItemProps = {
  id: string
  name: string
  image: string
  price: number
}

export function useRocketItem({ id, name, price, image }: UseRocketItemProps) {
  const { user, updateUser } = useAuthContext()
  const { playAudio } = useAudioContext()
  const toast = useToastContext()
  const api = useApi()

  async function handleShopButtonBuy() {
    if (!user) return

    const response = await api.saveAcquiredRocket(id, user.id)

    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    await updateUser(user)
  }

  async function handleShopButtonClick() {
    if (!user) return

    const currentAcquiredRocketsCount = user.acquiredRocketsCount

    user.buyRocket(Rocket.create({ id, name, image, price }))

    if (currentAcquiredRocketsCount.value === user.acquiredRocketsCount.value) {
      await updateUser(user)
      playAudio('switch.wav')
    }
  }

  return {
    handleShopButtonBuy,
    handleShopButtonClick,
  }
}
