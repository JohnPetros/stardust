'use client'

import { useApi } from '@/ui/global/hooks/useApi'
import { useRocketItem } from './useRocketItem'
import { RocketAggregate } from '@stardust/core/profile/aggregates'
import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { RocketItemView } from './RocketItemView'
import { Id, Integer } from '@stardust/core/global/structures'

type Props = {
  id: string
  name: string
  image: string
  price: number
}

export const RocketItem = ({ id, name, image, price }: Props) => {
  const { user } = useAuthContext()
  const { profileService } = useRest()
  const { handleRocketAcquire } = useRocketItem(
    RocketAggregate.create({
      id,
      entity: {
        name,
        image,
      },
    }),
    Integer.create(price),
    profileService,
  )
  const api = useApi()
  const rocketImage = api.fetchImage('rockets', image)

  if (user)
    return (
      <RocketItemView
        id={id}
        image={rocketImage}
        name={name}
        price={price}
        isAcquired={user?.hasAcquiredRocket(Id.create(id)).isTrue}
        isBuyable={user?.canAcquire(Integer.create(price)).isTrue}
        isSelected={user?.isSelectRocket(Id.create(id)).isTrue}
        onAcquire={handleRocketAcquire}
      />
    )
}
