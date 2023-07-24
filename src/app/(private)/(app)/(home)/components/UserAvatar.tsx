import { useAuth } from '@/hooks/useAuth'
import { useAvatar } from '@/hooks/useAvatar'
import { getImage } from '@/utils/functions'

import * as Avatar from '@radix-ui/react-avatar'
import { Loading } from './Loading'

interface UserAvatarProps {
  avatarId: string
  size: number
}

export function UserAvatar({ avatarId, size }: UserAvatarProps) {
  const { avatar } = useAvatar(avatarId)
  const avatarImage = avatar ? getImage('avatars', avatar.image) : ''

  if (avatar)
    return (
      <Avatar.Root>
        <Avatar.Image
          src={avatarImage}
          width={size}
          height={size}
          className="rounded-full border border-green-700"
          alt={avatar.name}
        />
        <Avatar.Fallback className="AvatarFallback" delayMs={600}>
          <Loading />
        </Avatar.Fallback>
      </Avatar.Root>
    )
}
