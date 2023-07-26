'use client'
import { Icon } from '@phosphor-icons/react'
import { Variants, motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

interface SidenavButtonProps {
  icon: Icon
  title: string
  isExpanded: boolean
  isActive: boolean
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
  onClick,
}: SidenavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'bg-transparent flex items-center justify-center text-gray-100 text-sm h-auto w-max p-2 hover:bg-green-500/30 transition-colors duration-200 rounded-md',
        isActive ? 'bg-green-500/30' : ''
      )}
    >
      <Icon className="text-green-400 text-lg" />
      <motion.span
        variants={titleVariants}
        initial="shrink"
        animate={isExpanded ? 'expand' : ''}
        className="block overflow-hidden"
      >
        {title}
      </motion.span>
    </button>
  )
}
