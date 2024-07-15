'use client'

import { Rocket } from '@/@core/domain/entities'
import { useApi } from '@/infra/api'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useToastContext } from '@/modules/global/contexts/ToastContext'
import { playAudio } from '@/modules/global/utils'

type UseRocketItemProps = {
  id: string
  name: string
  image: string
  price: number
}

export function useRocketItem({ id, name, price, image }: UseRocketItemProps) {
  const { user, updateUser } = useAuthContext()

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
