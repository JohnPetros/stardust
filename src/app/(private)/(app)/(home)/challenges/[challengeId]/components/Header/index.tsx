import { PopoverMenu, PopoverMenuButton } from '@/app/components/PopoverMenu'
import { ArrowLeft, List } from '@phosphor-icons/react'
import { NavButton } from '../NavButton'

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
    <header className="flex flex-col justify-center  md:border-b md:border-green-700">
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center py-3 gap-3">
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
      </div>

      <nav className="bg-gray-800">
        <ul className="grid grid-cols-3">
          {['Problema', 'Código', 'Resultado'].map((button) => (
            <li key={button}>
              <NavButton isActive={false}>{button}</NavButton>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
