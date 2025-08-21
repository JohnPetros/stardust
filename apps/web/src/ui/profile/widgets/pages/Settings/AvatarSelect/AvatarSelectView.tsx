import type { AvatarAggregate } from '@stardust/core/profile/aggregates'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'

type Props = {
  selectedAvatar: AvatarAggregate
}

export const AvatarSelectView = ({ selectedAvatar }: Props) => {
  return (
    <div className='relative'>
      <UserAvatar
        avatarImage={selectedAvatar?.image.value}
        avatarName={selectedAvatar?.name.value}
        size={100}
      />
      <button type='button' className='absolute top-20 right-0 text-sm text-green-400'>
        <Icon name='edit' />
      </button>
    </div>
  )
}
