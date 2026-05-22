'use client'

import Image from 'next/image'
import Link from 'next/link'

import { CountBadge } from '@/ui/global/widgets/components/CountBadge'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { SignOutAlertDialog } from '@/ui/global/widgets/components/SignOutAlertDialog'
import { AchievementsList } from '../AchievementsList'
import { NavLink } from '../NavLink'
import { AnimatedAchievementsList } from './AnimatedAchievementsList'
import { AnimatedContainer } from './AnimatedContainer'
import { SidenavButton } from './SidenavButton'

type SidenavViewProps = {
  isExpanded: boolean
  isAchievementsListVisible: boolean
  links: Array<{
    route: string
    label: string
    icon: string
  }>
  isNotesActive: boolean
  rescueableAchievementsCount: number
  onToggleSidenav: VoidFunction
  onNotesClick: VoidFunction
  onAchievementsClick: VoidFunction
}

export function SidenavView({
  isExpanded,
  isAchievementsListVisible,
  links,
  isNotesActive,
  rescueableAchievementsCount,
  onToggleSidenav,
  onNotesClick,
  onAchievementsClick,
}: SidenavViewProps) {
  return (
    <AnimatedContainer isExpanded={isExpanded}>
      <div className='reative flex h-full flex-col justify-between'>
        <button
          type='button'
          onClick={onToggleSidenav}
          tabIndex={0}
          aria-label='Expandir barra de navegação lateral'
          aria-expanded={isExpanded ? 'true' : 'false'}
          aria-controls='sidenav'
          className='absolute -right-[10px] top-20 z-40 grid place-content-center rounded-full bg-green-400 p-1 outline-green-500 size-6'
        >
          {isExpanded ? (
            <Icon
              name='arrow-left'
              className='text-sm text-gray-800'
              size={16}
              weight='bold'
            />
          ) : (
            <Icon
              name='arrow-right'
              className='text-sm text-gray-800'
              size={16}
              weight='bold'
            />
          )}
        </button>
        <div>
          <Link
            href='/'
            className='mx-3 grid h-16 place-content-center overflow-hidden border-b border-green-700'
          >
            {isExpanded ? (
              <Image
                src='/images/logo.svg'
                width={96}
                height={96}
                loading='eager'
                alt='StarDust'
              />
            ) : (
              <Image
                src='/icons/rocket.svg'
                width={30}
                height={30}
                loading='eager'
                alt=''
              />
            )}
          </Link>

          <nav className='mt-12 flex flex-col gap-3 px-3'>
            {links.map(({ route, icon, label }) => (
              <NavLink
                key={label}
                route={route}
                label={label}
                icon={icon}
                isExpanded={isExpanded}
                isColumn={false}
              />
            ))}
          </nav>
        </div>

        <AnimatedAchievementsList isAchievementsListVisible={isAchievementsListVisible}>
          <AchievementsList />
        </AnimatedAchievementsList>

        <div className='mx-3 flex flex-col items-start gap-2 border-t border-green-700 px-3 py-3'>
          <SidenavButton
            icon='book'
            title='Notas'
            isExpanded={isExpanded}
            onClick={onNotesClick}
            isActive={isNotesActive}
          />

          <SidenavButton
            icon='achievement'
            title='Conquistas'
            isExpanded={isExpanded}
            onClick={onAchievementsClick}
            isActive={isAchievementsListVisible}
            countBadge={<CountBadge count={rescueableAchievementsCount} />}
          />

          <SignOutAlertDialog>
            <SidenavButton
              icon='sign-out'
              title='Sair'
              isExpanded={isExpanded}
              onClick={() => null}
              isActive={false}
            />
          </SignOutAlertDialog>
        </div>
      </div>
    </AnimatedContainer>
  )
}
