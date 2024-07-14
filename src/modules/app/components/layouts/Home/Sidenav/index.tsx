'use client'

import Image from 'next/image'
import Link from 'next/link'

import { AnimatedContainer } from './AnimatedContainer'
import { SignOutAlertDialog } from '@/modules/global/components/shared/SignOutAlertDialog'
import { NavLink } from '../NavLink'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useSiderbarContext } from '@/modules/app/contexts/SidebarContext'
import { HOME_LINKS } from '../home-links'
import { SidenavButton } from './SidenavButton'
import { CountBadge } from '@/modules/global/components/shared/CountBadge'
import { Icon } from '@/modules/global/components/shared/Icon'
import { AnimatedAchievementsList } from './AnimatedAchievementsList'
import { AchievementsList } from '../AchievementsList'

type SidenavProps = {
  isExpanded: boolean
  toggleSidenav: VoidFunction
}

export function Sidenav({ isExpanded, toggleSidenav }: SidenavProps) {
  const { user } = useAuthContext()
  const { isAchievementsListVisible, setIsAchievementsListVisible } = useSiderbarContext()

  function handleAchievementsListButtonClick() {
    setIsAchievementsListVisible(!isAchievementsListVisible)
  }

  return (
    <AnimatedContainer isExpanded={isExpanded}>
      <div className='reative flex h-full flex-col justify-between'>
        <button
          type='button'
          onClick={toggleSidenav}
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
            className='mx-3 grid h-16 place-content-center border-b border-green-700'
          >
            {isExpanded ? (
              <Image src='/images/logo.svg' width={96} height={96} alt='StarDust' />
            ) : (
              <Image src='/icons/rocket.svg' width={30} height={30} alt='' />
            )}
          </Link>

          <nav className='mt-12 flex flex-col gap-3 px-3'>
            {HOME_LINKS.map(({ route, icon, label }) => {
              return (
                <NavLink
                  key={route}
                  route={route === '/profile' ? `${route}/${user?.slug.value}` : route}
                  label={label}
                  icon={icon}
                  isExpanded={isExpanded}
                  isColumn={false}
                />
              )
            })}
          </nav>
        </div>

        <AnimatedAchievementsList isAchievementsListVisible={isAchievementsListVisible}>
          <AchievementsList />
        </AnimatedAchievementsList>

        <div className='mx-3 flex flex-col items-start border-t border-green-700 px-3 py-3'>
          {user && (
            <SidenavButton
              icon='achievement'
              title='Conquistas'
              isExpanded={isExpanded}
              onClick={handleAchievementsListButtonClick}
              isActive={isAchievementsListVisible}
              countBadge={<CountBadge count={user.rescueableAchievementsCount.value} />}
            />
          )}

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
