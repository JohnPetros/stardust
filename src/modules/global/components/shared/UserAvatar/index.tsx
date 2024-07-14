'use client'

import * as Avatar from '@radix-ui/react-avatar'
import Image from 'next/image'

import { useApi } from '@/infra/api'

type UserAvatarProps = {
  avatarUrl: string
  avatarName: string
  size: number
}

export function UserAvatar({ avatarName, avatarUrl, size }: UserAvatarProps) {
  const api = useApi()
  const avatarImage = api.fetchImage('avatars', avatarUrl)

  return (
    <div
      style={{ width: size, height: size, borderRadius: '50%' }}
      className='relative grid place-content-center overflow-hidden border border-green-700 bg-gray-300 shrink-0'
    >
      <Avatar.Root>
        <Avatar.Image src={avatarImage} asChild>
          <Image
            src={avatarImage}
            fill
            alt={avatarName}
            className='skeleton'
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
          />
        </Avatar.Image>
      </Avatar.Root>
    </div>
  )
}
