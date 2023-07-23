import Link from 'next/link'
import { Icon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'

interface NavButtonProps {
  path: string
  label: string
  icon: string
  isCol?: boolean
  isExpanded?: boolean
  isActive: boolean
}

export function NavButton({
  path,
  label,
  icon,
  isCol = true,
  isExpanded = true,
  isActive,
}: NavButtonProps) {
  return (
    <Link
      href={path}
      className={twMerge(
        'rounded-xl p-3 hover:bg-green-500/30 transition-colors duration-200 flex items-center justify-center gap-2',
        isCol ? 'flex-col' : 'flex-row'
      )}
    >
      <span
        className={twMerge(
          'rounded-lg w-12 h-10 grid place-content-center',
          isActive ? 'bg-green-400' : 'bg-green-700'
        )}
      >
        <Image
          src={`/icons/${icon}`}
          width={26}
          height={26}
          className="text-gray-800"
          alt=""
        />
      </span>
      {isExpanded && (
        <span
          className={twMerge(
            'font-semibold text-xs',
            isActive ? 'text-white' : 'text-gray-300'
          )}
        >
          {label}
        </span>
      )}
    </Link>
  )
}
