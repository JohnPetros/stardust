'use client'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import { Tooltip } from '@/app/components/@Tooltip'

const labelVariants: Variants = {
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

interface NavButtonProps {
  path: string
  label: string
  icon: string
  isColumn?: boolean
  isExpanded?: boolean
}

export function NavButton({
  path,
  label,
  icon,
  isColumn = true,
  isExpanded = true,
}: NavButtonProps) {
  const pathname = usePathname()
  const isActive = pathname === path

  return (
    <Tooltip content={!isExpanded ? label : ''} direction="right">
      <Link
        href={path}
        className={twMerge(
          'flex items-center justify-center rounded-xl p-2 outline-green-500 transition-colors duration-200 hover:bg-green-700/20 md:w-max',
          isColumn ? 'flex-col' : 'flex-row'
        )}
      >
        <span
          className={twMerge(
            'grid h-10 w-10 place-content-center rounded-lg',
            isActive ? 'bg-green-400' : 'bg-green-800'
          )}
        >
          <Image
            src={`/icons/${icon}`}
            width={28}
            height={28}
            className="text-gray-800"
            alt={icon}
          />
        </span>

        <motion.span
          variants={labelVariants}
          initial="shrink"
          animate={isExpanded ? 'expand' : ''}
          className={twMerge(
            '-ml-2 mt-2 block overflow-hidden text-[12px] font-semibold md:-m-0 md:text-sm',
            isActive ? 'text-gray-100' : 'text-gray-400'
          )}
        >
          {label}
        </motion.span>
      </Link>
    </Tooltip>
  )
}
