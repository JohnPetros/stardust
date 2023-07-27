'use client'
import { Loading } from '@/app/components/Loading'
import { useAvatar } from '@/hooks/useAvatar'
import { getImage } from '@/utils/functions'

import * as Avatar from '@radix-ui/react-avatar'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

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
        className="relative rounded-[50%] border border-green-700 bg-gray-300 overflow-hidden grid place-content-center"
      >
        {avatarImage ? (
          <Image src={avatarImage} fill className="" alt={avatar.name} />
        ) : (
          <Loading />
        )}
      </div>
    )
}
