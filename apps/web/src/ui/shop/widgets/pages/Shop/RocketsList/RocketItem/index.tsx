'use client'

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
  const { profileService, storageService } = useRest()
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
  const rocketImage = storageService.fetchImage('rockets', image)

  if (user)
    return (
      <RocketItemView
        id={id}
        image={rocketImage}
        name={name}
        price={price}
        isAcquired={user?.hasAcquiredRocket(Id.create(id)).isTrue}
        isBuyable={user?.canAcquire(Integer.create(price)).isTrue}
        isSelected={user?.isRocketSelected(Id.create(id)).isTrue}
        onAcquire={handleRocketAcquire}
      />
    )
}
