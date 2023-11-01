'client'

import { ArrowLeft, List } from '@phosphor-icons/react'

import { PopoverMenu, PopoverMenuButton } from '@/app/components/PopoverMenu'
import { useChallengeContext } from '@/hooks/useChallengeContext'
import { useChallengeStore } from '@/hooks/useChallengeStore'

const popoverMenuButtons: PopoverMenuButton[] = [
  {
    title: 'Soluções de outros usuários',
    isToggle: false,
    value: null,
    action: () => {},
  },
]

export function Header() {
  const { state } = useChallengeStore()

  return (
    <header className="flex h-12 flex-col justify-center md:border-b md:border-green-700">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-3 py-3">
          <button>
            <ArrowLeft className="text-xl text-green-400" weight="bold" />
          </button>
          <h2 className="text-lg font-semibold text-gray-100">
            {state.challenge?.title}
          </h2>
        </div>
        <PopoverMenu
          buttons={popoverMenuButtons}
          trigger={<List className="text-xl text-green-400" weight="bold" />}
        />
      </div>
    </header>
  )
}
