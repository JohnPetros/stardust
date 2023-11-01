'use client'
import Image from 'next/image'

import { Loading } from '@/app/components/Loading'
import { useAvatar } from '@/hooks/useAvatar'
import { getImage } from '@/utils/helpers'

interface UserAvatarProps {
  avatarId: string
  size: number
}

export function UserAvatar({ avatarId, size }: UserAvatarProps) {
  const { avatar } = useAvatar(avatarId)
  const avatarImage = avatar ? getImage('avatars', avatar.image) : ''

  if (avatar)
    return (
      <div
        style={{ width: size, height: size }}
        className="relative grid place-content-center overflow-hidden rounded-[50%] border border-green-700 bg-gray-300"
      >
        {avatarImage ? (
          <Image
            src={avatarImage}
            fill
            alt={avatar.name}
            className="skeleton"
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
          />
        ) : (
          <Loading />
        )}
      </div>
    )
}
