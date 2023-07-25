'use client'
import Image from 'next/image'
import { NavButton } from './NavButton'
import { HOME_PAGES } from '@/utils/constants/home-pages'
import { Flag, Power } from '@phosphor-icons/react'
import SidenavButton from './SidenavButton'
import { Button } from '@/app/components/Button'

export function Sidenav() {
  return (
    <div className="absolute left-0 bg-gray-900 w-20 h-full z-50 flex flex-col justify-between">
      <div>
        <div className="border-b border-green-700 p-3 grid place-content-center">
          <Image src="/icons/rocket.svg" width={32} height={32} alt="" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          {HOME_PAGES.map(({ path, icon, label }) => (
            <NavButton
              path={path}
              label={label}
              icon={icon}
              isExpanded={false}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-green-700 flex flex-col items-center py-3">
        <Button className="bg-transparent flex items-center gap-2 text-gray-100 text-sm h-auto w-max p-2 hover:bg-green-500/30 transition-colors duration-200">
          <Flag className="text-green-400 text-xl" weight="bold" />
          {/* {false && 'Conquistas'} */}
        </Button>

        <Button className="bg-transparent flex items-center gap-2 text-gray-100 text-sm h-auto w-max p-2 hover:bg-green-500/30 transition-colors duration-200">
          <Power className="text-green-400 text-xl" weight="bold" />
          {/* {false && 'Sair'} */}
        </Button>
      </div>
    </div>
  )
}
