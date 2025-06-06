'use client'

import { Integer } from '@stardust/core/global/structures'
import { Id } from '@stardust/core/global/structures'
import { AvatarAggregate } from '@stardust/core/profile/aggregates'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext/hooks/useAuthContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { useRest } from '@/ui/global/hooks/useRest'
import { useAvatarItem } from './useAvatarItem'
import { AvatarItemView } from './AvatarItemView'

type Props = {
  id: string
  name: string
  image: string
  price: number
}

export function AvatarItem({ id, name, image, price }: Props) {
  const { profileService } = useRest()
  const { user } = useAuthContext()
  const { handleAvatarAcquire } = useAvatarItem(
    AvatarAggregate.create({ id, entity: { name, image } }),
    Integer.create(price),
    profileService,
  )
  const api = useApi()
  const avatarImage = api.fetchImage('avatars', image)

  if (user)
    return (
      <AvatarItemView
        image={avatarImage}
        name={name}
        price={price}
        isAcquired={user.hasAcquiredAvatar(Id.create(id)).isTrue}
        isBuyable={user.canAcquire(Integer.create(price)).isTrue}
        isSelected={user.isSelectAvatar(Id.create(id)).isTrue}
        onAcquire={handleAvatarAcquire}
      />
    )
}
