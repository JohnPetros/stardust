'use client'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon, X } from '@phosphor-icons/react'

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
    <div
      className={
        'flex items-center justify-center gap-2 rounded-md bg-gray-800 text-gray-300 text-xs w-max p-2'
      }
    >
      {Icon && iconStyles && <Icon className={iconStyles} />}
      <p className={nameStyles ?? ''}>{name}</p>
      <button
        onClick={onClick}
        className="grid place-content-center bg-gray-400 rounded-full p-[1px]"
      >
        <X className="text-gray-800" widths={8} weight="bold" />
      </button>
    </div>
  )
}
