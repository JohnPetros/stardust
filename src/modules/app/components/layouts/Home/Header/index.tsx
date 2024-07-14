'use client'

import Image from 'next/image'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useSiderbarContext } from '@/modules/app/contexts/SidebarContext'
import { CountBadge } from '@/modules/global/components/shared/CountBadge'
import { UserAvatar } from '@/modules/global/components/shared/UserAvatar'
import { Animation } from '@/modules/global/components/shared/Animation'
import { AnimatedContainer } from './AnimatedContainer'
import { Icon } from '@/modules/global/components/shared/Icon'

export function Header() {
  const { user } = useAuthContext()
  const { toggle, isOpen } = useSiderbarContext()
  // const { rescueableAchievementsCount } = useAchivementsContext()

  if (user)
    return (
      <AnimatedContainer>
        <div className='flex items-center gap-3 md:hidden'>
          <button
            type='button'
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-controls='sidebar'
            onClick={toggle}
            className='relative'
          >
            <CountBadge count={user.rescueableAchievementsCount.value} />
            <Icon name='menu' className='text-green-400' weight='bold' />
          </button>
          <Image src='/images/logo.svg' width={100} height={100} alt='StarDust' />
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <Image src='/icons/coin.svg' width={26} height={26} alt='Star Coins' />
            <span className='block pt-1 text-lg font-semibold text-yellow-400'>
              {user.coins.value}
            </span>
          </div>

          <div className='flex items-center'>
            <Animation name='streak' size={32} hasLoop={false} />
            <span className='text-lg font-semibold text-green-500'>
              {user.streak.value}
            </span>
          </div>
        </div>

        {user && (
          <div className='ml-6 hidden items-center gap-6 md:flex'>
            <div className='flex flex-col items-center text-sm text-gray-100'>
              <strong>{user.name.value}</strong>
              <small>{user.email.value}</small>
            </div>
            <UserAvatar
              avatarUrl={user.avatar.image}
              avatarName={user.avatar.name.value}
              size={48}
            />
          </div>
        )}
      </AnimatedContainer>
    )
}
