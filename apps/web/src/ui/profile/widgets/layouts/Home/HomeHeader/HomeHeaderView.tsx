'use client'

import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { CountBadge } from '@/ui/global/widgets/components/CountBadge'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import { AnimatedContainer } from './AnimatedContainer'

type HomeHeaderViewProps = {
  isSidebarOpen: boolean
  rescueableAchievementsCount: number
  coins: number
  streak: number
  isTodayDone: boolean
  name: string
  email: string
  avatarImage: string
  avatarName: string
  onSidebarToggle: VoidFunction
}

export function HomeHeaderView({
  isSidebarOpen,
  rescueableAchievementsCount,
  coins,
  streak,
  isTodayDone,
  name,
  email,
  avatarImage,
  avatarName,
  onSidebarToggle,
}: HomeHeaderViewProps) {
  return (
    <AnimatedContainer>
      <div className='flex items-center gap-3 md:hidden'>
        <button
          type='button'
          aria-expanded={isSidebarOpen ? 'true' : 'false'}
          aria-controls='sidebar'
          onClick={onSidebarToggle}
          className='relative'
        >
          <CountBadge count={rescueableAchievementsCount} />
          <Icon name='menu' className='text-green-400' weight='bold' />
        </button>
        <Image src='/images/logo.svg' width={100} height={100} alt='StarDust' />
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Icon name='coins' size={26} weight='bold' className='text-yellow-400' />
          <span className='block pt-1 text-lg font-semibold text-yellow-400'>
            {coins}
          </span>
        </div>

        <div className='flex items-center'>
          <Icon
            name='fire'
            size={24}
            weight='bold'
            className={isTodayDone ? 'text-green-500' : 'text-gray-300'}
          />
          <span
            className={twMerge(
              'text-lg font-semibold ',
              isTodayDone ? 'text-green-500' : 'text-gray-300',
            )}
          >
            {streak}
          </span>
        </div>
      </div>

      <div className='ml-6 hidden items-center gap-6 md:flex'>
        <div className='flex flex-col items-center text-sm text-gray-100'>
          <strong>{name}</strong>
          <small>{email}</small>
        </div>
        <UserAvatar avatarImage={avatarImage} avatarName={avatarName} size={48} />
      </div>
    </AnimatedContainer>
  )
}
