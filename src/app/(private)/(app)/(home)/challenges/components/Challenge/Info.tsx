'use client'
import { Icon } from '@phosphor-icons/react'



interface InfoProps {
  label: string | number
  icon: Icon
}

export function Info({ label, icon: Icon }: InfoProps) {
  return (
    <li className="flex items-center gap-1 text-sm text-gray-400">
      <Icon className="text-gray-400 text-sm" weight="bold" />
      {label}
    </li>
  )
}
