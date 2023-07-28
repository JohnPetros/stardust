'use client'
import { useSiderbar } from '@/hooks/useSiderbar'
import { useAuth } from '@/hooks/useAuth'
import { UserAvatar } from './UserAvatar'

import { Animation } from '@/app/components/Animation'
import { List } from '@phosphor-icons/react'
import Image from 'next/image'

import StreakAnimation from '../../../../../../public/animations/streak.json'

import { Variants, motion } from 'framer-motion'

const headerVariants: Variants = {
  hidden: {
    y: -64,
  },
  visible: {
    y: 0,
    transition: {
      delay: 2,
    },
  },
}

export function Header() {
  const { user } = useAuth()
  const { toggle } = useSiderbar()

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 w-screen z-40 bg-gray-900 h-16 px-6 py-3 flex justify-between md:justify-end border-b border-gray-700"
    >
      <div className="flex items-center gap-3 md:hidden">
        <button onClick={toggle}>
          <List
            width={24}
            height={24}
            className="text-green-400"
            weight="bold"
          />
        </button>
        <Image src="/images/logo.svg" width={100} height={100} alt="StarDust" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/coin.svg"
            width={28}
            height={28}
            alt="Star Coins"
          />
          <span className="text-yellow-400 font-semibold text-lg">
            {user?.coins}
          </span>
        </div>

        <div className="flex items-center">
          <Animation src={StreakAnimation} size={32} hasLoop={false} />
          <span className="text-green-500 font-semibold text-lg">
            {user?.streak}
          </span>
        </div>
      </div>

      {user && (
        <div className="hidden md:flex items-center gap-6 ml-6">
          <div className="flex flex-col items-center text-sm text-gray-100">
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </div>
          <UserAvatar avatarId={user?.avatar_id} size={56} />
        </div>
      )}
    </motion.header>
  )
}
