'use client'

import { Integer } from '@stardust/core/global/structures'
import { Id } from '@stardust/core/global/structures'
import { AvatarAggregate } from '@stardust/core/profile/aggregates'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext/hooks/useAuthContext'
import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useAvatarItem } from './useAvatarItem'
import { AvatarItemView } from './AvatarItemView'

type Props = {
  id: string
  name: string
  image: string
  price: number
}

export function AvatarItem({ id, name, image, price }: Props) {
  const { profileService } = useRestContext()
  const { user } = useAuthContext()
  const { handleAvatarAcquire } = useAvatarItem(
    AvatarAggregate.create({ id, entity: { name, image } }),
    Integer.create(price),
    profileService,
  )
  const avatarImage = useFileStorage(FileStorageFolderPath.createAsImagesAvatars(), image)

  if (user)
    return (
      <AvatarItemView
        image={avatarImage}
        name={name}
        price={price}
        isAcquired={user.hasAcquiredAvatar(Id.create(id)).isTrue}
        isBuyable={user.canAcquire(Integer.create(price)).isTrue}
        isSelected={user.isAvatarSelected(Id.create(id)).isTrue}
        onAcquire={handleAvatarAcquire}
      />
    )
}
