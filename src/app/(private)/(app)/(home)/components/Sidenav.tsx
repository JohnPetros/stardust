'use client'

import { useRef } from 'react'
import { CaretLeft, CaretRight, Flag, Power } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

import { AchievementsList } from './AchievementsList'
import { CounterBadge } from './CounterBadge'
import { NavButton } from './NavButton'
import { SidenavButton } from './SidenavButton'
import { SignOutAlert } from './SignOutAlert'

import { Toast, ToastRef } from '@/app/components/Toast'
import { useAchivements } from '@/contexts/AchievementsContext'
import { useAuth } from '@/contexts/AuthContext'
import { useSiderbar } from '@/contexts/SidebarContext'
import { HOME_PAGES } from '@/utils/constants/home-pages'

const sidenavAnimations: Variants = {
  shrink: {
    width: 88,
  },
  expand: {
    width: 164,
  },
}

const achievementsAnimations: Variants = {
  hidden: {
    width: 0,
    // opacity: 0,
  },
  visible: {
    width: 320,
    // opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.2,
      when: 'beforeChildren',
    },
  },
}

interface SidenavProps {
  isExpanded: boolean
  toggleSidenav: VoidFunction
}

export function Sidenav({ isExpanded, toggleSidenav }: SidenavProps) {
  const { user } = useAuth()
  const { isAchievementsListVisible, setIsAchievementsListVisible } =
    useSiderbar()
  const { rescueableAchievementsAmount } = useAchivements()

  const toastRef = useRef<ToastRef>(null)

  function handleAchievementsListButtonClick() {
    setIsAchievementsListVisible(!isAchievementsListVisible)
  }

  return (
    <motion.div
      id="sidenav"
      variants={sidenavAnimations}
      initial="shrink"
      animate={isExpanded ? 'expand' : ''}
      className="left-0 top-0 z-50 hidden h-full bg-gray-900 md:fixed md:flex"
    >
      <Toast ref={toastRef} />

      <div className="reative flex h-full flex-col justify-between">
        <button
          onClick={toggleSidenav}
          tabIndex={0}
          aria-label="Expandir barra de navegação lateral"
          className="absolute -right-[10px] top-20 z-40 grid place-content-center rounded-full bg-green-400 p-1 outline-green-500"
          aria-expanded={isExpanded ? 'true' : 'false'}
          aria-controls="sidenav"
        >
          {isExpanded ? (
            <CaretLeft className="text-sm text-gray-800" weight="bold" />
          ) : (
            <CaretRight className="text-sm text-gray-800" weight="bold" />
          )}
        </button>
        <div>
          <Link
            href="/"
            className="mx-3 grid h-16 place-content-center border-b border-green-700"
          >
            {isExpanded ? (
              <Image
                src="/images/logo.svg"
                width={96}
                height={96}
                alt="StarDust"
              />
            ) : (
              <Image src="/icons/rocket.svg" width={30} height={30} alt="" />
            )}
          </Link>

          <nav className="mt-12 flex flex-col gap-3 px-3">
            {HOME_PAGES.map(({ path, icon, label }) => {
              return (
                <NavButton
                  key={path}
                  path={path === '/profile' ? `${path}/${user?.id}` : path}
                  label={label}
                  icon={icon}
                  isExpanded={isExpanded}
                  isColumn={false}
                />
              )
            })}
          </nav>
        </div>

        <AnimatePresence>
          {isAchievementsListVisible && (
            <motion.div
              variants={achievementsAnimations}
              initial="hidden"
              animate={isAchievementsListVisible ? 'visible' : ''}
              exit="hidden"
              className="custom-scrollbar absolute right-0 top-0 mt-16 h-full w-80 translate-x-[100%] overflow-hidden overflow-y-scroll border-l border-green-400 bg-gray-900"
            >
              <AchievementsList />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-3 flex flex-col items-start gap-1 border-t border-green-700 px-3 py-3">
          <SidenavButton
            icon={Flag}
            title="Conquistas"
            isExpanded={isExpanded}
            onClick={handleAchievementsListButtonClick}
            isActive={isAchievementsListVisible}
            counterBadge={
              rescueableAchievementsAmount > 0 ? (
                <CounterBadge count={rescueableAchievementsAmount} />
              ) : (
                <></>
              )
            }
          />

          <SignOutAlert>
            <SidenavButton
              icon={Power}
              title="Sair"
              isExpanded={isExpanded}
              onClick={() => null}
              isActive={false}
            />
          </SignOutAlert>
        </div>
      </div>
    </motion.div>
  )
}
