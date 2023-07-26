'use client'
import { Icon } from '@phosphor-icons/react'
import { Variants, motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import { Loading } from './Loading'

interface SidenavButtonProps {
  icon: Icon
  title: string
  isExpanded: boolean
  isActive: boolean
  isLoading: boolean
  onClick: VoidFunction
}

const titleVariants: Variants = {
  shrink: {
    width: 0,
  },
  expand: {
    width: 'auto',
    paddingLeft: '8px',
    transition: {
      delay: 0.05,
    },
  },
}

export function SidenavButton({
  icon: Icon,
  title,
  isExpanded,
  isActive,
  isLoading,
  onClick,
}: SidenavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'bg-transparent flex items-center justify-center text-gray-100 text-sm p-3 h-auto w-max hover:bg-green-700/30 transition-colors duration-200 rounded-md relative',
        isActive ? 'bg-green-500/30' : ''
      )}
      disabled={isLoading}
    >
      {isLoading && !isExpanded ? (
        <div className="relative py-0 px-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loading />
          </div>
        </div>
      ) : (
        <Icon className="text-green-400 text-lg" />
      )}
      <motion.span
        variants={titleVariants}
        initial="shrink"
        animate={isExpanded ? 'expand' : ''}
        className="block overflow-hidden"
      >
        {isLoading ? <Loading /> : title}
      </motion.span>
    </button>
  )
}
