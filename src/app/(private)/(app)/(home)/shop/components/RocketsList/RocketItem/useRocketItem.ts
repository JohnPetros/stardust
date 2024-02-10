'use client'

import { useEffect, useState } from 'react'

import { RocketProps } from '.'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { useAudio } from '@/global/hooks/useAudio'
import { useApi } from '@/services/api'

export function useRocketItem({
  data: { id, name, price, image, isAcquired },
  addUserAcquiredRocket,
}: RocketProps) {
  const { user, updateUser } = useAuthContext()

  // const { mutate } = useSWRConfig()

  const [isSelected, setIsSelected] = useState(false)

  const toast = useToastContext()
  const api = useApi()
  const audio = useAudio('switch.wav')

  const rocketImage = api.getImage('rockets', image)
  const isBuyable = user ? user?.coins >= price : false

  async function handleShopSuccess() {
    if (user) {
      const updatedCoins = user?.coins - price
      const updatedAcquiredRockets = user?.acquiredRocketsCount + 1

      await Promise.all([
        updateUser({
          coins: updatedCoins,
          acquiredRocketsCount: updatedAcquiredRockets,
        }),
        addUserAcquiredRocket(id),
      ])
    }
  }

  async function selectRocket() {
    try {
      await updateUser({ rocketId: id })
      // mutate('/rocket?id=' + id, { id, name, image })

      audio?.play()
    } catch (error) {
      toast.show('Erro ao tentar selecionar o foguete ' + name, {
        type: 'error',
      })
    }
  }

  async function buyRocket() {
    if (!isBuyable || !user) {
      return
    }

    try {
      await selectRocket()
    } catch (error) {
      toast.show('Erro ao tentar selecionar o foguete ' + name, {
        type: 'error',
      })
      console.error(error)
    }
  }

  async function handleShopButton() {
    if (isAcquired) {
      await selectRocket()
      return
    }

    buyRocket()
  }

  useEffect(() => {
    if (user) setIsSelected(id === user.rocketId)
  }, [id, user])

  return {
    isSelected,
    isBuyable,
    rocketImage,
    handleShopSuccess,
    handleShopButton,
  }
}
