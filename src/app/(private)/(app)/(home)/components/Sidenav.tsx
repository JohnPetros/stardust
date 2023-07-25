'use client'

import { useState } from 'react'
import Image from 'next/image'

import { CaretLeft, CaretRight, Flag, Power } from '@phosphor-icons/react'
import { Button } from '@/app/components/Button'
import { NavButton } from './NavButton'
import { HOME_PAGES } from '@/utils/constants/home-pages'
import { Variants, motion } from 'framer-motion'
import SidenavButton from './SidenavButton'

const sidenavVariants: Variants = {
  shrink: {
    width: 88,
  },
  expand: {
    width: 164,
  },
}

export function Sidenav() {
  const [isExpanded, setIsExpanded] = useState(false)

  function handleExpandClick() {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      variants={sidenavVariants}
      initial="shrink"
      animate={isExpanded ? 'expand' : ''}
      className="hidden md:flex md:fixed left-0 bg-gray-900 h-full z-50"
    >
      <div className="reative flex flex-col justify-between h-full">
        <button
          onClick={handleExpandClick}
          className="absolute top-20 -right-2 rounded-full bg-green-400 p-1 grid place-content-center"
        >
          {isExpanded ? (
            <CaretRight className="text-gray-800 text-sm" weight="bold" />
          ) : (
            <CaretLeft className="text-gray-800 text-sm" weight="bold" />
          )}
        </button>
        <div>
          <div className="border-b border-green-700 h-16 mx-3 grid place-content-center">
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
          </div>

          <nav className="mt-12 flex flex-col px-3 gap-3">
            {HOME_PAGES.map(({ path, icon, label }) => (
              <NavButton
                path={path}
                label={label}
                icon={icon}
                isExpanded={isExpanded}
                isColumn={false}
              />
            ))}
          </nav>

        </div>

        <div className="border-t border-green-700 flex flex-col mx-3 px-3 py-3">
          <SidenavButton
            icon={Flag}
            title="Conquistas"
            isExpanded={isExpanded}
          />

          <SidenavButton icon={Power} title="Sair" isExpanded={isExpanded} />
        </div>
      </div>
    </motion.div>
  )
}
