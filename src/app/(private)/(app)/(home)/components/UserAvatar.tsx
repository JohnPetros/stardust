'use client'
import * as Avatar from '@radix-ui/react-avatar'
import Image from 'next/image'

import { useAvatar } from '@/hooks/useAvatar'
import { getImage } from '@/utils/helpers'

interface UserAvatarProps {
  avatarId: string
  size: number
}

export function UserAvatar({ avatarId, size }: UserAvatarProps) {
  const { avatar } = useAvatar(avatarId)
  const avatarImage = avatar ? getImage('avatars', avatar.image) : ''

  return (
    <div
      style={{ width: size, height: size }}
      className="relative grid place-content-center overflow-hidden rounded-[50%] border border-green-700 bg-gray-300"
    >
      <Avatar.Root>
        <Avatar.Image src={avatarImage} asChild>
          <Image
            src={avatarImage}
            fill
            alt={avatar?.name ?? ''}
            className="skeleton"
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
          />
        </Avatar.Image>
      </Avatar.Root>
    </div>
  )
}
