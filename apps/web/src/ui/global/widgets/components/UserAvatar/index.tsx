'use client'

import * as Avatar from '@radix-ui/react-avatar'

import { useApi } from '@/ui/global/hooks'

type UserAvatarProps = {
  avatarImage: string
  avatarName: string
  size: number
}

export function UserAvatar({ avatarImage, avatarName, size }: UserAvatarProps) {
  const api = useApi()
  const avatarImageSrc = api.fetchImage('avatars', avatarImage)

  return (
    <Avatar.Root>
      <Avatar.Image
        src={avatarImageSrc}
        style={{ width: size, height: size, borderRadius: '50%' }}
        onLoad={(element) => element.currentTarget.classList.remove('skeleton')}
        alt={`Avatar ${avatarName}`}
        loading='eager'
        className='skeleton relative grid place-content-center overflow-hidden border border-green-700 bg-gray-300 shrink-0 rounded-full'
      />
    </Avatar.Root>
  )
}
