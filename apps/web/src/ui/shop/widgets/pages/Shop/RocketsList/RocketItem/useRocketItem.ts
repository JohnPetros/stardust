'use client'

import { RocketAggregate } from '@stardust/core/profile/aggregates'

import { useApi } from '@/ui/global/hooks/useApi'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAudioContext } from '@/ui/global/contexts/AudioContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Integer } from '@stardust/core/global/structures'

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

    const response = await api.saveAcquiredRocket(id, user.id.value)

    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    await updateUser(user)
  }

  async function handleShopButtonClick() {
    if (!user) return

    const currentAcquiredRocketsCount = user.acquiredRocketsCount

    user.buyRocket(
      RocketAggregate.create({ id, entity: { name, image } }),
      Integer.create(price),
    )

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
