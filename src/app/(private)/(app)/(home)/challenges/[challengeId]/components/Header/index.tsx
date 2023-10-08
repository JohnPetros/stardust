'client'

import { useChallengeContext } from '@/hooks/useChallengeContext'
import { PopoverMenu, PopoverMenuButton } from '@/app/components/PopoverMenu'
import { ArrowLeft, List } from '@phosphor-icons/react'

const popoverMenuButtons: PopoverMenuButton[] = [
  {
    title: 'Soluções de outros usuários',
    isToggle: false,
    value: null,
    action: () => {},
  },
]

export function Header() {
  const { state } = useChallengeContext()

  return (
    <header className="flex flex-col justify-center md:border-b md:border-green-700 h-12">
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center py-3 gap-3">
          <button>
            <ArrowLeft className="text-green-400 text-xl" weight="bold" />
          </button>
          <h2 className="text-gray-100 font-semibold text-lg">
            {state.challenge?.title}
          </h2>
        </div>
        <PopoverMenu
          buttons={popoverMenuButtons}
          trigger={<List className="text-green-400 text-xl" weight="bold" />}
        />
      </div>
    </header>
  )
}
