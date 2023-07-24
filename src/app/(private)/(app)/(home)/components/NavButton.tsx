'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface NavButtonProps {
  path: string
  label: string
  icon: string
  isCol?: boolean
  isExpanded?: boolean
}

export function NavButton({
  path,
  label,
  icon,
  isCol = true,
  isExpanded = true,
}: NavButtonProps) {
  const pathname = usePathname()
  const isActive = pathname === path

  return (
    <Link
      href={path}
      className={twMerge(
        'rounded-xl hover:bg-green-500/30 transition-colors duration-200 flex items-center justify-center gap-2',
        isCol ? 'flex-col' : 'flex-row'
      )}
    >
      <span
        className={twMerge(
          'rounded-lg w-12 h-10 grid place-content-center',
          isActive ? 'bg-green-400' : 'bg-green-800'
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
            'font-semibold text-sm',
            isActive ? 'text-gray-100' : 'text-gray-400'
          )}
        >
          {label}
        </span>
      )}
    </Link>
  )
}
