import { Datetime } from '@stardust/core/global/libs'

import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { AdornmentGroup } from './AdornmentsGroup'
import { AccountLinks } from './SettingsLink'

type UserProps = {
  id: string
  name: string
  tier: {
    name: string
    image: string
  }
  avatar: {
    image: string
    name: string
  }
  rocket: {
    name: string
    image: string
  }
  level: number
  xp: number
  createdAt: Date
}

export function Account({
  id,
  name,
  level,
  avatar,
  rocket,
  tier,
  createdAt,
  xp,
}: UserProps) {
  const formattedCreatedAt = new Datetime(createdAt).format('DD MMMM [de] YYYY')

  return (
    <div className='flex flex-col border-b border-gray-700 md:pb-6 md:flex-row md:justify-between md:gap-6'>
      <div className='flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6'>
        <UserAvatar avatarName={avatar.name} avatarImage={avatar.image} size={148} />
        <div className='flex flex-col gap-2 md:items-start'>
          <strong className='mt-3 truncate text-center text-lg font-semibold text-green-500'>
            {name}
          </strong>
          <div className='flex items-center justify-center gap-2'>
            <Icon name='shield' className='hidden text-lg text-green-500 md:block' />
            <strong className='text-sm text-gray-100'>
              Nível {level} - {xp} xp
            </strong>
          </div>

          <div className='flex items-center justify-center gap-2'>
            <Icon name='calendar' className='hidden text-lg text-green-500 md:block' />
            <p className='text-sm text-gray-300'>Por aqui desde {formattedCreatedAt}</p>
          </div>
        </div>
      </div>

      <dl className='mt-6 flex justify-between md:flex-row md:gap-8'>
        <AdornmentGroup tier={tier} rocket={rocket} />
      </dl>

      <div className='flex w-full md:w-6 md:h-full justify-start'>
        <AccountLinks id={id} />
      </div>
    </div>
  )
}
