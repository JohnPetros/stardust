'use client'
import { Animation } from '@/app/components/Animation'
import { useAuth } from '@/hooks/useAuth'
import { List } from '@phosphor-icons/react'
import Image from 'next/image'

import StreakAnimation from '../../../../../../public/animations/streak.json'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-gray-900 border-b border-green-800 px-6 py-3 flex justify-between">
        <div className="flex items-center gap-3">
          <button>
            <List
              width={24}
              height={24}
              className="text-green-400"
              weight="bold"
            />
          </button>
          <Image src="/images/logo.svg" width={80} height={80} alt="StarDust" />
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
    </header>
  )
}
