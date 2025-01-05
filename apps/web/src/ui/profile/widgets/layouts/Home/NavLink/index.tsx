'use client'

import Image from 'next/image'
import Link from 'next/link'

import { twMerge } from 'tailwind-merge'

import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import { AnimatedLabel } from './AnimatedLabel'
import { useRouter } from '@/ui/global/hooks'

type NavButtonProps = {
  route: string
  label: string
  icon: string
  isColumn?: boolean
  isExpanded?: boolean
}

export function NavLink({
  route,
  label,
  icon,
  isColumn = true,
  isExpanded = true,
}: NavButtonProps) {
  const router = useRouter()
  const isActive = router.currentRoute === route

  return (
    <Tooltip content={!isExpanded ? label : ''} direction='right'>
      <Link
        href={route}
        className={twMerge(
          'flex items-center justify-center gap-1 rounded-xl p-2 outline-green-500 transition-colors duration-200 hover:bg-green-700/20 md:w-max',
          isColumn ? 'flex-col' : 'flex-row',
        )}
      >
        <span
          className={twMerge(
            'grid h-10 w-10 place-content-center rounded-lg',
            isActive ? 'bg-green-400' : 'bg-green-800',
          )}
        >
          <Image
            src={`/icons/${icon}`}
            width={28}
            height={28}
            className='text-gray-800'
            alt={icon}
          />
        </span>

        <AnimatedLabel isActive={isActive} isExpanded={isExpanded}>
          {label}
        </AnimatedLabel>
      </Link>
    </Tooltip>
  )
}
