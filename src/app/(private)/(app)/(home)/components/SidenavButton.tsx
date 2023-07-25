'use client'
import { Icon } from '@phosphor-icons/react'
import { Variants, motion } from 'framer-motion'

interface SidenavButtonProps {
  icon: Icon
  title: string
  isExpanded: boolean
}

const titleVariants: Variants = {
  shrink: {
    width: 0,
  },
  expand: {
    width: 'auto',
    transition: {
      delay: 0.05,
    },
  },
}

export default function SidenavButton({
  icon: Icon,
  title,
  isExpanded,
}: SidenavButtonProps) {
  return (
    <button className="bg-transparent flex items-center gap-2 text-gray-100 text-sm h-auto w-max p-2 hover:bg-green-500/30 transition-colors duration-200">
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
