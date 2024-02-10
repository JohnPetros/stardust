'use client'
import * as Avatar from '@radix-ui/react-avatar'
import Image from 'next/image'

import { useUserAvatar } from './useUserAvatar'

import { useApi } from '@/services/api'

type UserAvatarProps = {
  avatarId: string
  size: number
}

export function UserAvatar({ avatarId, size }: UserAvatarProps) {
  const avatar = useUserAvatar(avatarId)
  const { getImage } = useApi()
  console.log('UserAvatar', { avatar })
  const avatarImage = avatar ? getImage('avatars', avatar.image) : ''

  return (
    <div
      style={{ width: size, height: size, borderRadius: '50%' }}
      className="relative grid place-content-center overflow-hidden border border-green-700 bg-gray-300"
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
