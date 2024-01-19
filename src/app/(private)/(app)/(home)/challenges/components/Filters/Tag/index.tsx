'use client'
import { Icon, X } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'

const tagVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -32,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

interface TagProps {
  name: string
  nameStyles: string | null
  icon: Icon | null
  iconStyles: string | null
  onClick: () => void
}

export function Tag({
  name,
  nameStyles,
  icon: Icon,
  iconStyles,
  onClick,
}: TagProps) {
  return (
    <motion.div
      variants={tagVariants}
      layout
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={
        'flex h-max w-max items-center justify-center gap-2 rounded-md bg-gray-800 p-2 text-xs text-gray-300'
      }
    >
      {Icon && iconStyles && <Icon className={iconStyles} />}
      <p className={nameStyles ?? ''}>{name}</p>
      <button
        onClick={onClick}
        className="grid place-content-center rounded-full bg-gray-400 p-[1px]"
      >
        <X className="text-gray-800" widths={8} weight="bold" />
      </button>
    </motion.div>
  )
}
