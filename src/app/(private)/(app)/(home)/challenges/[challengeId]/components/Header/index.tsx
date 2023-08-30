import { PopoverMenu, PopoverMenuButton } from '@/app/components/PopoverMenu'
import { ArrowLeft, List } from '@phosphor-icons/react'

interface HeaderProps {
  challengeTitle: string
}

const popoverMenuButtons: PopoverMenuButton[] = [
  {
    title: 'Dicionário',
    isToggle: false,
    value: null,
    action: () => {},
  },
  {
    title: 'Dark Mode',
    isToggle: true,
    value: false,
    action: () => {},
  },
  {
    title: 'Font Size',
    isToggle: false,
    value: null,
    action: () => {},
  },
  {
    title: 'Copiar código',
    isToggle: false,
    value: null,
    action: () => {},
  },
]

export function Header({ challengeTitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-green-400">
      <div className="flex items-center gap-3">
        <button>
          <ArrowLeft className="text-green-400 text-xl" weight="bold" />
        </button>
        <h2 className="text-gray-100 font-semibold text-lg">
          {challengeTitle}
        </h2>
      </div>
      <PopoverMenu
        buttons={popoverMenuButtons}
        trigger={<List className="text-green-400 text-xl" weight="bold" />}
      />
    </header>
  )
}
