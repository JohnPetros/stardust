'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'

import { X } from '@phosphor-icons/react'
import Image from 'next/image'

import { getImage } from '@/utils/functions'
import { ProgressBar } from '@/app/components/ProgressBar'

export function Header() {
  const { user } = useAuth()
  const { rocket } = useRocket(user?.rocket_id)
  const rocketImage = rocket ? getImage('rockets', rocket.image) : ''

  return (
    <header className="fixed z-10 top-0 py-3 w-full bg-gray-900">
      <div className="flex items-center justify-between gap-6 max-w-3xl mx-auto">
        <button>
          <X className="text-red-700 text-2xl" weight="bold" />
        </button>

        <ProgressBar value={50} height={16} indicatorImage={rocketImage} />

        <div className="flex items-center gap-2">
          <Image src="/icons/life.svg" width={36} height={36} alt="" />
          <span className="text-red-700 text-lg font-bold">5</span>
        </div>
      </div>
    </header>
  )
}

{
  /* <header className="fixed z-10 w-full top-0 bg-gray-900">
<div className="max-w-3xl w-full mx-auto flex items-center justify-between gap-6">
  <button>
    <X className="text-red-700 text-2xl" weight="bold" />
  </button>

  <ProgressBar value={50} height={16} indicatorImage={rocketImage} />

  <div className="flex items-center gap-2">
    <Image src="/icons/life.svg" width={36} height={36} alt="" />
    <span className="text-red-700 text-lg font-bold">5</span>
  </div>
</div>
</header> */
}
