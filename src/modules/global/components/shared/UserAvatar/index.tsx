'use client'

import * as Avatar from '@radix-ui/react-avatar'

import { useApi } from '@/infra/api'

type UserAvatarProps = {
  avatarImage: string
  size: number
}

export function UserAvatar({ avatarImage, size }: UserAvatarProps) {
  const api = useApi()
  const avatarImageSrc = api.fetchImage('avatars', avatarImage)

  return (
    <Avatar.Root>
      <Avatar.Image
        src={avatarImageSrc}
        className='skeleton relative grid place-content-center overflow-hidden border border-green-700 bg-gray-300 shrink-0 rounded-full'
        style={{ width: size, height: size, borderRadius: '50%' }}
        onLoad={(element) => element.currentTarget.classList.remove('skeleton')}
      />
    </Avatar.Root>
  )
}
