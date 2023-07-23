'use client'
import { Animation } from '@/app/components/Animation'
import { useAuth } from '@/hooks/useAuth'
import { List } from '@phosphor-icons/react'
import Image from 'next/image'

import StreakAnimation from '../../../../../../public/animations/streak.json'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-gray-900 border-b border-green-800 px-6 py-3">
      <div className="container flex justify-between">
        <div className="flex items-center gap-3">
          <button>
            <List
              width={32}
              height={32}
              className="text-green-400"
              weight="bold"
            />
          </button>
          <Image
            src="/images/logo.svg"
            width={120}
            height={120}
            alt="StarDust"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/coin-icon.svg"
              width={32}
              height={32}
              alt="Star Coins"
            />
            <span className="text-yellow-400 font-semibold text-lg">{user?.coins}</span>
          </div>

          <div className="flex items-center">
            <Animation src={StreakAnimation} size={40} hasLoop={false} />
            <span className="text-green-500 font-semibold text-lg">{user?.streak}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
