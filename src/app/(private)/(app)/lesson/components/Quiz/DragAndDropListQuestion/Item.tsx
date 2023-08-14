import { List } from '@phosphor-icons/react'
import Image from 'next/image'

interface ItemProps {
  label: string
}

export function Item({ label }: ItemProps) {
  return (
    <div className="rounded-md flex items-center justify-between bg-purple-700 border-2 p-3 w-full max-w-sm mx-auto">
      <strong className="text-medium text-gray-100">{label}</strong>
      <List className="text-gray-100 text-lg" />
    </div>
  )
}
